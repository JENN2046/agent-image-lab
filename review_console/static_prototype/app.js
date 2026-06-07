const mock = window.REVIEW_CONSOLE_MOCK;
const scoreModel = mock.score_model;

const state = {
  session_id: mock.review_session.session_id,
  task_id: mock.review_session.task_id,
  case_id: mock.review_session.case_id,
  project: mock.review_session.project,
  status: mock.review_session.status,
  currentVersionId: mock.review_session.current_version_id,
  compareVersionId: mock.review_session.compare_version_id,
  image_versions: mock.review_session.image_versions,
  ai_review: mock.review_session.ai_review,
  human_review: mock.review_session.human_review,
  comments: [...mock.review_session.comments],
  annotation_notes: mock.review_session.annotation_notes,
  version_comparison: mock.review_session.version_comparison,
  approval: mock.review_session.approval,
  assetStatus: mock.review_session.archive_decision.asset_status,
  memoryStatus: mock.review_session.memory_approval.status,
  memory_preview: mock.review_session.memory_preview,
  next_iteration: mock.review_session.next_iteration,
  audit_log: mock.review_session.audit_log,
  adapter_dry_run_handoff: mock.adapter_dry_run_handoff,
  review_result_protocol_static_handoff: mock.review_result_protocol_static_handoff,
  review_decision_package_static_handoff: mock.review_decision_package_static_handoff,
  review_evidence_blocker_contract_static_handoff: mock.review_evidence_blocker_contract_static_handoff,
  review_blocker_arbiter_static_handoff: mock.review_blocker_arbiter_static_handoff,
  review_report_static_handoff: mock.review_report_static_handoff,
  review_report_negative_guard_static_handoff: mock.review_report_negative_guard_static_handoff,
  review_evidence_blocker_adapter_negative_static_handoff: mock.review_evidence_blocker_adapter_negative_static_handoff,
  artifact_dashboard_evidence: mock.artifact_recoverability_dashboard_evidence,
  portable_preview_capsule_evidence: mock.portable_preview_capsule_evidence,
  portable_preview_capsule_evidence_list: mock.portable_preview_capsule_evidence_list,
  full_asset_archive_baseline_state: mock.full_asset_archive_baseline_state_seed,
  controlled_visual_production_loop_contract: mock.controlled_visual_production_loop_contract_seed,
  controlled_visual_production_loop_review_bridge_state: mock.controlled_visual_production_loop_review_bridge_seed,
  unified_capsule_contract_report: mock.unified_capsule_contract_report,
  portable_failure_capsule_evidence: mock.portable_failure_capsule_evidence,
  portable_failure_capsule_evidence_list: mock.portable_failure_capsule_evidence_list,
  artifact_lifecycle_state_reader: mock.artifact_lifecycle_state_reader_seed,
  third_sample_authorization_package: mock.third_sample_accepted_samples_authorization_package_seed,
  third_sample_post_approval_gate: mock.third_sample_post_approval_gate_seed,
  human_approval_blocker_queue: mock.human_approval_blocker_queue_seed,
  exact_new_trial_003_formal_human_approval_capture_surface: mock.exact_new_trial_003_formal_human_approval_capture_surface_seed,
  runtime_gap_dashboard: mock.review_console_runtime_gap_dashboard_contract_seed,
  readonly_review_corpus_renderer: mock.visual_eval_readonly_review_corpus_renderer_static_handoff,
  readonly_visual_review_mvp_seed: mock.readonly_visual_review_mvp_seed,
  readonly_visual_review_dataset_regression_seed: mock.readonly_visual_review_dataset_regression_seed,
  lifecycleFilter: "all",
  lifecycleSearch: "",
  selectedArtifactId: mock.artifact_lifecycle_state_reader_seed.records[0].sample_id,
  sampleDrawerOpen: false,
  previewDisplaySkinId: "studio_dashboard",
  previewDisplaySelectedPreviewId: "preview-display-asset-archive-accepted-french-summer-rattan-bucket-bag-001",
  previewStageZoomPercent: 100,
  highRiskSheetOpen: false,
  selectedSpineBlockerId: null,
  evidenceMode: "triage",
  blockerSeverityFilter: "all",
  blockerSourceFilter: "all",
  lastEvidenceAnchor: {
    anchor_id: null,
    source: null,
    target: null,
    located: false,
    located_at: null
  },
  import_record_reader: {
    source_mode: "project_local_seed",
    parsed: null,
    parse_status: "not_loaded",
    errors: [],
    guard: {
      parsed_in_memory: false,
      fetch_performed: false,
      file_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      mcp_runtime_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false
    }
  },
  humanScores: { ...mock.review_session.human_review.breakdown },
  lastDecisionEvent: {
    scope: "archive",
    message_cn: "当前资产已标记为候选，等待人工最终确认。",
    changed_at: "seed_state",
    changed_by: "seed_state",
    downstream_effect_cn: "仅刷新本地草案；production、DailyNote、VCP 写入仍为 false。"
  }
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function safeClassToken(value) {
  return String(value ?? "").replace(/[^A-Za-z0-9_-]/g, "");
}

function listItemsHtml(items) {
  return (Array.isArray(items) ? items : []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function inlineList(items, fallback = "none") {
  const values = Array.isArray(items) ? items : [];
  return escapeHtml(values.length > 0 ? values.join(", ") : fallback);
}

const previewDisplaySkins = [
  {
    skin_id: "studio_dashboard",
    skin_class: "preview-skin-studio-dashboard",
    label_cn: "三仪表看板",
    aspect_ratio: "16:9",
    tone: "",
    recipe_cn: "中央大仪表、左右辅仪表、右侧风险栏和底部任务条。"
  },
  {
    skin_id: "product_still_life",
    skin_class: "preview-skin-product-still-life",
    label_cn: "商品静物",
    aspect_ratio: "4:5",
    tone: "success",
    recipe_cn: "单品主体、台面切线、柔和冷白高光和可复用样片感。"
  },
  {
    skin_id: "editorial_portrait",
    skin_class: "preview-skin-editorial-portrait",
    label_cn: "编辑肖像",
    aspect_ratio: "3:4",
    tone: "warning",
    recipe_cn: "人物轮廓、竖幅构图、背景分区和审片备注焦点。"
  },
  {
    skin_id: "evidence_blocker",
    skin_class: "preview-skin-evidence-blocker",
    label_cn: "阻断证据",
    aspect_ratio: "1:1",
    tone: "danger",
    recipe_cn: "局部缺口、红黄风险边、证据锚点和待批准状态。"
  }
];

const assetArchiveRealPreviewRenderActivation = {
  phase: "review_console_asset_archive_real_preview_render_activation_20260608",
  original_render_phase: "review_console_asset_archive_original_image_zoom_20260608",
  gate_ref: "tests/schema_examples/ASSET_ARCHIVE_REAL_PREVIEW_RENDER_GATE.example.json",
  source_mapping_ref: "tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_MAPPING_DRAFT.example.json",
  enabled: "yes" === "yes",
  authorized_answer: "yes",
  allowed_operation: "browser_load_existing_tracked_preview_refs_only",
  real_image_source_policy: "tracked_asset_archive_preview_ref_required_for_clean_checkout_review",
  max_preview_refs: 3,
  max_original_refs: 3,
  selected_preview_refs: [
    {
      preview_id: "preview-display-asset-archive-accepted-french-summer-rattan-bucket-bag-001",
      version_id: "accepted_french_summer_rattan_bucket_bag_001",
      sample_number: 21,
      label: "Accepted probe 01",
      variant: "Receipt mapped accepted preview",
      score: null,
      skin_id: "product_still_life",
      source_asset_ref: "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp",
      source_original_ref: "runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg",
      source_preview_ref: "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp",
      source_manifest_ref: "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/manifest.json"
    },
    {
      preview_id: "preview-display-asset-archive-accepted-product-still-life-tennis-wallet-001",
      version_id: "accepted_product_still_life_tennis_wallet_001",
      sample_number: 22,
      label: "Accepted probe 02",
      variant: "Receipt mapped accepted preview",
      score: null,
      skin_id: "studio_dashboard",
      source_asset_ref: "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp",
      source_original_ref: "runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg",
      source_preview_ref: "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp",
      source_manifest_ref: "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/manifest.json"
    },
    {
      preview_id: "preview-display-asset-archive-failure-french-summer-rattan-bag-v7-29-001",
      version_id: "failure_french_summer_rattan_bag_v7_29_001",
      sample_number: 23,
      label: "Failure probe 01",
      variant: "Receipt mapped failure preview",
      score: null,
      skin_id: "evidence_blocker",
      source_asset_ref: "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp",
      source_original_ref: "runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg",
      source_preview_ref: "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp",
      source_manifest_ref: "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json"
    }
  ]
};

function totalFrom(values, scoreIndex) {
  return scoreModel.reduce((sum, item) => {
    const key = item[0];
    return sum + (values ? Number(values[key] || 0) : Number(item[scoreIndex] || 0));
  }, 0);
}

function currentVersion() {
  return state.image_versions.find((version) => version.version_id === state.currentVersionId);
}

function nowIso() {
  return new Date().toISOString();
}

function importRecordSeedText() {
  return JSON.stringify(mock.codex_session_import_record_seed.codex_session_image_import, null, 2);
}

function normalizeImportRecord(raw) {
  if (raw && raw.codex_session_image_import) return raw.codex_session_image_import;
  return raw;
}

function parseImportRecordText(sourceMode) {
  const text = qs("#importRecordInput").value.trim();
  const guard = {
    parsed_in_memory: false,
    fetch_performed: false,
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false
  };
  try {
    const record = normalizeImportRecord(JSON.parse(text));
    const asset = record.imported_asset || {};
    const reviewBridge = record.review_bridge || {};
    const noExecutionGuard = record.no_execution_guard || {};
    const required = [
      ["import_id", record.import_id],
      ["provider_id", record.provider_id],
      ["prompt_package_ref", record.prompt_package_ref],
      ["imported_asset.relative_path", asset.relative_path],
      ["imported_asset.sha256", asset.sha256],
      ["imported_asset.width_px", asset.width_px],
      ["imported_asset.height_px", asset.height_px],
      ["imported_asset.mime_type", asset.mime_type],
      ["review_bridge.review_record_ref", reviewBridge.review_record_ref]
    ];
    const missing = required.filter((item) => item[1] === undefined || item[1] === null || item[1] === "").map((item) => item[0]);
    const blockedExecution = [
      noExecutionGuard.provider_contact_performed_by_project,
      noExecutionGuard.plugin_call_performed_by_project,
      noExecutionGuard.api_call_performed_by_project,
      noExecutionGuard.image_generation_performed_by_project,
      noExecutionGuard.DailyNote_write_performed,
      noExecutionGuard.VCP_memory_write_performed,
      noExecutionGuard.real_manifest_read_performed,
      noExecutionGuard.real_VCPChat_read_performed,
      noExecutionGuard.real_VCPToolBox_read_performed
    ].some(Boolean);
    if (missing.length > 0) {
      throw new Error(`missing required fields: ${missing.join(", ")}`);
    }
    if (blockedExecution) {
      throw new Error("import record reports a forbidden execution side effect");
    }
    guard.parsed_in_memory = true;
    state.import_record_reader = {
      source_mode: sourceMode,
      parse_status: "parsed",
      errors: [],
      parsed: {
        import_id: record.import_id,
        provider_id: record.provider_id,
        prompt_package_ref: record.prompt_package_ref,
        asset_ref: asset.relative_path,
        mime_type: asset.mime_type,
        dimensions: `${asset.width_px}x${asset.height_px}`,
        sha256: asset.sha256,
        review_record_ref: reviewBridge.review_record_ref,
        review_status: reviewBridge.review_status,
        local_file_verified: asset.local_file_verified === true,
        accepted_candidate: reviewBridge.accepted_candidate === true
      },
      guard
    };
  } catch (error) {
    state.import_record_reader = {
      source_mode: sourceMode,
      parse_status: "parse_failed",
      errors: [error.message],
      parsed: null,
      guard
    };
  }
  renderImportRecordReader();
  renderDraft();
}

function renderImportRecordReader() {
  const reader = state.import_record_reader;
  const parsed = reader.parsed || {};
  const status = qs("#importRecordStatus");
  status.classList.toggle("approved", reader.parse_status === "parsed");
  status.textContent = reader.parse_status === "parsed"
    ? "Import record parsed in browser memory only. No fetch, file write, provider, plugin, API, DailyNote, or VCP memory action was performed."
    : `Import record not accepted: ${reader.errors.join("; ") || "not parsed yet"}`;
  qs("#importRecordSummary").innerHTML = reader.parse_status === "parsed" ? `
    <span>source <strong>${escapeHtml(reader.source_mode)}</strong></span>
    <span>import <strong>${escapeHtml(parsed.import_id)}</strong></span>
    <span>mime <strong>${escapeHtml(parsed.mime_type)}</strong></span>
    <span>size <strong>${escapeHtml(parsed.dimensions)}</strong></span>
    <span>local verified <strong>${escapeHtml(parsed.local_file_verified)}</strong></span>
  ` : `
    <span>source <strong>${escapeHtml(reader.source_mode)}</strong></span>
    <span>status <strong>${escapeHtml(reader.parse_status)}</strong></span>
  `;
}

function renderArtifactEvidenceDashboard() {
  const evidence = state.artifact_dashboard_evidence;
  const capsule = state.portable_preview_capsule_evidence;
  const capsules = state.portable_preview_capsule_evidence_list || [capsule];
  const failureCapsule = state.portable_failure_capsule_evidence;
  const failureCapsules = state.portable_failure_capsule_evidence_list || (failureCapsule ? [failureCapsule] : []);
  const capsuleIds = capsules.map((item) => item.sample_id).join(", ");
  const failureCapsuleIds = failureCapsules.map((item) => item.sample_id).join(", ");
  qs("#artifactEvidenceSummary").innerHTML = `
    <span>sample <strong>${escapeHtml(evidence.accepted_sample_id)}</strong></span>
    <span>status <strong>${escapeHtml(evidence.recoverability_status)}</strong></span>
    <span>size <strong>${escapeHtml(evidence.verified_dimensions)}</strong></span>
    <span>hash <strong>${escapeHtml(evidence.verified_sha256.slice(0, 12))}</strong></span>
    <span>basis <strong>${escapeHtml(evidence.dashboard_progress_basis)}</strong></span>
    <span>runtime <strong>${escapeHtml(evidence.vcp_runtime_integration_proven)}</strong></span>
    <span>capsules <strong>${escapeHtml(capsules.length)}</strong></span>
    <span>capsule ids <strong>${escapeHtml(capsuleIds)}</strong></span>
    <span>preview <strong>${escapeHtml(capsule.preview_format)} ${escapeHtml(capsule.preview_long_edge)}</strong></span>
    <span>portable <strong>${escapeHtml(capsule.clone_portable_validation_status)}</strong></span>
    <span>failure capsules <strong>${escapeHtml(failureCapsules.length)}</strong></span>
    <span>failure ids <strong>${escapeHtml(failureCapsuleIds || "none")}</strong></span>
    <span>failure route <strong>${escapeHtml(failureCapsule?.final_route || "none")}</strong></span>
    <span>failure portable <strong>${escapeHtml(failureCapsule?.clone_portable_validation_status || "none")}</strong></span>
  `;
}

function fullAssetArchiveBaselineState() {
  return state.full_asset_archive_baseline_state;
}

function renderFullAssetArchiveBaseline() {
  const archive = fullAssetArchiveBaselineState();
  qs("#fullAssetArchiveBaselineSummary").innerHTML = `
    <span>sample <strong>${escapeHtml(archive.sample_id)}</strong></span>
    <span>archive <strong>${escapeHtml(archive.archive_baseline_status)}</strong></span>
    <span>storage <strong>${escapeHtml(archive.storage_strategy)}</strong></span>
    <span>preview portable <strong>${escapeHtml(archive.preview_clone_portable_validation_status)}</strong></span>
    <span>full archive <strong>${escapeHtml(archive.full_archive_readiness_status)}</strong></span>
    <span>runtime <strong>${escapeHtml(archive.guard.vcp_runtime_integration_proven)}</strong></span>
  `;
  qs("#fullAssetArchiveBaselineBody").innerHTML = `
    <article class="multi-capsule-card accepted">
      <div class="protocol-card-head">
        <strong>${escapeHtml(archive.sample_id)}</strong>
        <span>${escapeHtml(archive.category)}</span>
      </div>
      <dl>
        <div><dt>Manifest</dt><dd>${escapeHtml(archive.source_manifest_ref)}</dd></div>
        <div><dt>Preview capsule</dt><dd>${escapeHtml(archive.source_portable_preview_capsule_ref)}</dd></div>
        <div><dt>Durable original</dt><dd>${escapeHtml(archive.durable_original_ref)}</dd></div>
        <div><dt>SHA256</dt><dd>${escapeHtml(archive.durable_original_sha256)}</dd></div>
        <div><dt>Dimensions</dt><dd>${escapeHtml(archive.durable_original_dimensions)}</dd></div>
        <div><dt>MIME</dt><dd>${escapeHtml(archive.durable_original_mime_type)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(archive.verification_evidence_ref)}</dd></div>
        <div><dt>Tracking policy</dt><dd>${escapeHtml(archive.tracking_policy_decision)}</dd></div>
        <div><dt>Production write now</dt><dd>${escapeHtml(archive.production_candidate_write_allowed_now)}</dd></div>
        <div><dt>Memory write now</dt><dd>${escapeHtml(archive.memory_write_allowed_now)}</dd></div>
        <div><dt>Next blockers</dt><dd>${inlineList(archive.next_blockers)}</dd></div>
      </dl>
    </article>
  `;
  qs("#fullAssetArchiveBaselineGuard").innerHTML = `
    <span>static panel: ${escapeHtml(archive.guard.static_panel_only)}</span>
    <span>asset archive read: ${escapeHtml(archive.guard.asset_archive_read_performed)}</span>
    <span>preview loaded: ${escapeHtml(archive.guard.preview_loaded_or_rendered)}</span>
    <span>file write: ${escapeHtml(archive.guard.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(archive.guard.provider_contact_performed || archive.guard.plugin_call_performed || archive.guard.api_call_performed)}</span>
    <span>runtime proven: ${escapeHtml(archive.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function controlledVisualProductionLoopContractState() {
  return state.controlled_visual_production_loop_contract;
}

function renderControlledVisualProductionLoopContract() {
  const loop = controlledVisualProductionLoopContractState();
  qs("#controlledLoopSummary").innerHTML = `
    <span>route <strong>${escapeHtml(loop.route_alignment_status)}</strong></span>
    <span>accepted <strong>${escapeHtml(loop.accepted_sample_id)}</strong></span>
    <span>failure <strong>${escapeHtml(loop.failure_sample_id)}</strong></span>
    <span>aligned <strong>${escapeHtml(loop.alignment_summary.aligned_segment_count)}</strong></span>
    <span>blocked <strong>${escapeHtml(loop.alignment_summary.blocked_segment_count)}</strong></span>
    <span>review bound <strong>${escapeHtml(loop.alignment_summary.review_report_sample_bound_now)}</strong></span>
    <span>runtime <strong>${escapeHtml(loop.guard.vcp_runtime_integration_proven)}</strong></span>
  `;
  qs("#controlledLoopBody").innerHTML = loop.route_segments.map((segment) => `
    <article class="registry-report-v2-card">
      <strong>${escapeHtml(segment.segment)}</strong>
      <p>status: ${escapeHtml(segment.status)}</p>
      <p>sample: ${escapeHtml(segment.sample_id || loop.accepted_sample_id)}</p>
      <p>detail: ${escapeHtml(segment.validator_status || segment.contract_status || segment.verification_status || segment.blocker || segment.final_route || "n/a")}</p>
    </article>
  `).join("") + `
    <article class="multi-capsule-card accepted">
      <div class="protocol-card-head">
        <strong>${escapeHtml(loop.canonical_route_id)}</strong>
        <span>${escapeHtml(loop.category)}</span>
      </div>
      <dl>
        <div><dt>Capsule contract</dt><dd>${escapeHtml(loop.source_contract_links.capsule_contract_fixture_ref)}</dd></div>
        <div><dt>Archive manifest</dt><dd>${escapeHtml(loop.source_contract_links.archive_manifest_ref)}</dd></div>
        <div><dt>Archive snapshot</dt><dd>${escapeHtml(loop.source_contract_links.archive_baseline_snapshot_ref)}</dd></div>
        <div><dt>Review handoff</dt><dd>${escapeHtml(loop.source_contract_links.review_report_handoff_key)}</dd></div>
        <div><dt>Review bridge fixture</dt><dd>${escapeHtml(loop.source_contract_links.review_bridge_fixture_ref)}</dd></div>
        <div><dt>Review bridge status</dt><dd>${escapeHtml(loop.review_report_bridge.binding_status)}</dd></div>
        <div><dt>Next blockers</dt><dd>${inlineList(loop.next_blockers)}</dd></div>
        <div><dt>Next local moves</dt><dd>${inlineList(loop.next_local_moves)}</dd></div>
      </dl>
    </article>
  `;
  qs("#controlledLoopGuard").innerHTML = `
    <span>static panel: ${escapeHtml(loop.guard.static_panel_only)}</span>
    <span>asset archive read: ${escapeHtml(loop.guard.asset_archive_read_performed)}</span>
    <span>preview loaded: ${escapeHtml(loop.guard.preview_loaded_or_rendered)}</span>
    <span>file write: ${escapeHtml(loop.guard.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(loop.guard.provider_contact_performed || loop.guard.plugin_call_performed || loop.guard.api_call_performed)}</span>
    <span>production write: ${escapeHtml(loop.guard.production_candidate_write_performed)}</span>
    <span>runtime proven: ${escapeHtml(loop.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function controlledVisualProductionLoopReviewBridgeState() {
  return state.controlled_visual_production_loop_review_bridge_state;
}

function renderControlledVisualProductionLoopReviewBridge() {
  const bridge = controlledVisualProductionLoopReviewBridgeState();
  qs("#controlledLoopReviewBridgeSummary").innerHTML = `
    <span>binding <strong>${escapeHtml(bridge.review_report_binding_status)}</strong></span>
    <span>accepted <strong>${escapeHtml(bridge.accepted_sample_id)}</strong></span>
    <span>failure <strong>${escapeHtml(bridge.failure_sample_id)}</strong></span>
    <span>samples <strong>${escapeHtml(bridge.bridge_summary.sample_count)}</strong></span>
    <span>never production <strong>${escapeHtml(bridge.bridge_summary.never_production_count)}</strong></span>
    <span>generic handoff <strong>${escapeHtml(bridge.bridge_summary.generic_review_report_handoff_still_present)}</strong></span>
  `;
  qs("#controlledLoopReviewBridgeBody").innerHTML = bridge.bridge_rows.map((row) => `
    <article class="registry-report-v2-card">
      <strong>${escapeHtml(row.sample_id)}</strong>
      <p>${escapeHtml(row.lane)} | outcome: ${escapeHtml(row.review_outcome)} | status: ${escapeHtml(row.review_status)}</p>
      <p>memory: ${escapeHtml(row.memory_route)} | production: ${escapeHtml(row.production_route)}</p>
      <p>evidence: ${escapeHtml(row.review_evidence_status)}</p>
    </article>
  `).join("") + `
    <article class="multi-capsule-card accepted">
      <div class="protocol-card-head">
        <strong>${escapeHtml(bridge.canonical_route_id)}</strong>
        <span>${escapeHtml(bridge.review_bridge_version)}</span>
      </div>
      <dl>
        <div><dt>Loop contract</dt><dd>${escapeHtml(bridge.source_links.loop_contract_ref)}</dd></div>
        <div><dt>Generic handoff</dt><dd>${escapeHtml(bridge.source_links.generic_review_report_handoff_key)}</dd></div>
        <div><dt>Accepted capsule</dt><dd>${escapeHtml(bridge.source_links.accepted_capsule_ref)}</dd></div>
        <div><dt>Failure capsule</dt><dd>${escapeHtml(bridge.source_links.failure_capsule_ref)}</dd></div>
        <div><dt>Next blockers</dt><dd>${inlineList(bridge.next_blockers)}</dd></div>
      </dl>
    </article>
  `;
  qs("#controlledLoopReviewBridgeGuard").innerHTML = `
    <span>static panel: ${escapeHtml(bridge.guard.static_panel_only)}</span>
    <span>asset archive read: ${escapeHtml(bridge.guard.asset_archive_read_performed)}</span>
    <span>preview loaded: ${escapeHtml(bridge.guard.preview_loaded_or_rendered)}</span>
    <span>file write: ${escapeHtml(bridge.guard.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(bridge.guard.provider_contact_performed || bridge.guard.plugin_call_performed || bridge.guard.api_call_performed)}</span>
    <span>production write: ${escapeHtml(bridge.guard.production_candidate_write_performed)}</span>
    <span>runtime proven: ${escapeHtml(bridge.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function multiCapsuleDashboardState() {
  const acceptedCapsules = state.portable_preview_capsule_evidence_list || [state.portable_preview_capsule_evidence];
  const failureCapsules = state.portable_failure_capsule_evidence_list || [state.portable_failure_capsule_evidence];
  const acceptedById = new Map(acceptedCapsules.map((capsule) => [capsule.sample_id, capsule]));
  const relations = failureCapsules.map((failure) => {
    const accepted = acceptedById.get(failure.resolved_by_accepted_sample) || null;
    return {
      relation_id: `${failure.sample_id}__resolved_by__${failure.resolved_by_accepted_sample}`,
      failure_sample_id: failure.sample_id,
      accepted_sample_id: failure.resolved_by_accepted_sample,
      relation_status: accepted ? "linked" : "missing_accepted_capsule",
      failure_final_route: failure.final_route,
      failure_tags: failure.failure_tags || [],
      failure_manifest_ref: failure.manifest_ref,
      failure_preview_ref: failure.preview_ref,
      failure_record_ref: failure.failure_record_ref,
      failure_review_record_ref: failure.review_record_ref,
      accepted_manifest_ref: accepted?.manifest_ref || null,
      accepted_preview_ref: accepted?.preview_ref || null,
      accepted_import_record_ref: accepted?.import_record_ref || null,
      accepted_review_record_ref: accepted?.review_record_ref || null,
      accepted_approval_record_ref: accepted?.approval_record_ref || null,
      accepted_is_reusable_positive_example: Boolean(accepted),
      failure_is_never_production: failure.production_candidate_allowed === false && failure.final_route === "failure_learning_only_never_production"
    };
  });
  const acceptedPassingStatuses = new Set([
    "registry_driven_preview_capsules_verified",
    "durable_archive_evidence_verified"
  ]);
  const acceptedReportRows = acceptedCapsules.map((capsule) => ({
    lane: "accepted",
    sample_id: capsule.sample_id,
    status: capsule.validation_status,
    registry_validator_status: capsule.registry_validator_status,
    clone_portable_validation_status: capsule.clone_portable_validation_status,
    preview_ref: capsule.preview_ref,
    manifest_ref: capsule.manifest_ref,
    chain_refs: [capsule.import_record_ref, capsule.review_record_ref, capsule.approval_record_ref],
    passed: capsule.clone_portable_validation_status === "passed" && acceptedPassingStatuses.has(capsule.registry_validator_status)
  }));
  const failureReportRows = failureCapsules.map((capsule) => ({
    lane: "failure",
    sample_id: capsule.sample_id,
    status: capsule.validation_status,
    registry_validator_status: capsule.registry_validator_status,
    clone_portable_validation_status: capsule.clone_portable_validation_status,
    preview_ref: capsule.preview_ref,
    manifest_ref: capsule.manifest_ref,
    chain_refs: [capsule.failure_record_ref, capsule.review_record_ref],
    resolved_by_accepted_sample: capsule.resolved_by_accepted_sample,
    failure_tags: capsule.failure_tags || [],
    final_route: capsule.final_route,
    passed: capsule.clone_portable_validation_status === "passed" && capsule.registry_validator_status === "failure_sample_capsules_verified"
  }));
  const reportRows = acceptedReportRows.concat(failureReportRows);
  return {
    phase: "p6_multi_capsule_accepted_failure_dashboard_productization",
    execution_mode: "review_console_static_multi_capsule_dashboard_only",
    draft_output_key: "multi_capsule_dashboard_state",
    accepted_capsule_count: acceptedCapsules.length,
    failure_capsule_count: failureCapsules.length,
    total_capsule_count: acceptedCapsules.length + failureCapsules.length,
    accepted_sample_ids: acceptedCapsules.map((capsule) => capsule.sample_id),
    failure_sample_ids: failureCapsules.map((capsule) => capsule.sample_id),
    accepted_registry_statuses: Array.from(new Set(acceptedCapsules.map((capsule) => capsule.registry_validator_status))),
    failure_registry_statuses: Array.from(new Set(failureCapsules.map((capsule) => capsule.registry_validator_status))),
    clone_portable_statuses: Array.from(new Set(reportRows.map((row) => row.clone_portable_validation_status))),
    old_runs_source_required_for_portable_validation: false,
    old_runs_source_as_long_term_evidence: false,
    directory_as_registry_currently_sufficient: true,
    future_registry_report_shape: {
      report_version: "accepted_failure_capsule_report_v1",
      total: reportRows.length,
      passed: reportRows.filter((row) => row.passed).length,
      failed: reportRows.filter((row) => !row.passed).length,
      fields: [
        "lane",
        "sample_id",
        "status",
        "registry_validator_status",
        "clone_portable_validation_status",
        "preview_ref",
        "manifest_ref",
        "chain_refs",
        "failure_class_summary",
        "resolved_by_links"
      ]
    },
    per_sample_report: reportRows,
    failure_class_summary: {
      accepted_failed: acceptedReportRows.filter((row) => !row.passed).length,
      failure_failed: failureReportRows.filter((row) => !row.passed).length,
      missing_resolved_by_link: relations.filter((relation) => relation.relation_status !== "linked").length,
      production_or_memory_guard_violation: failureReportRows.filter((row) => row.final_route !== "failure_learning_only_never_production").length
    },
    resolved_by_links: relations,
    failure_track_expansion_plan: {
      next_capsule_creation_allowed_now: false,
      second_failure_capsule_requires_separate_authorization: true,
      candidate_selection_criteria: [
        "source failure has review record",
        "source failure has failure tags",
        "source failure has a useful accepted resolution link",
        "preview can be long_edge 512 without using provider or image generation"
      ],
      required_authorization_fields: [
        "sample_id",
        "source_image",
        "target_capsule_root",
        "allowed_write_paths",
        "validation_commands",
        "stop_conditions"
      ],
      stop_conditions: [
        "source image missing",
        "target capsule exists",
        "would overwrite existing capsule",
        "provider/plugin/API/image generation needed",
        "DailyNote/VCP memory/runtime needed"
      ]
    },
    guard: {
      static_dashboard_only: true,
      mock_in_memory_only: true,
      fetch_performed: false,
      file_write_performed: false,
      asset_archive_read_performed: false,
      accepted_samples_write_performed: false,
      failure_samples_write_performed: false,
      preview_creation_or_copy_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      production_candidate_write_performed: false,
      push_tag_release_deploy_performed: false,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderMultiCapsuleDashboard() {
  const dashboard = multiCapsuleDashboardState();
  qs("#multiCapsuleSummary").innerHTML = `
    <span>accepted <strong>${escapeHtml(dashboard.accepted_capsule_count)}</strong></span>
    <span>failure <strong>${escapeHtml(dashboard.failure_capsule_count)}</strong></span>
    <span>total <strong>${escapeHtml(dashboard.total_capsule_count)}</strong></span>
    <span>clone portable <strong>${inlineList(dashboard.clone_portable_statuses)}</strong></span>
    <span>old runs required <strong>${escapeHtml(dashboard.old_runs_source_required_for_portable_validation)}</strong></span>
    <span>linked failures <strong>${escapeHtml(dashboard.resolved_by_links.filter((item) => item.relation_status === "linked").length)}</strong></span>
  `;
  qs("#multiCapsuleReport").innerHTML = dashboard.per_sample_report.map((row) => `
    <article class="multi-capsule-card ${row.lane}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.sample_id)}</strong>
        <span>${escapeHtml(row.lane)}</span>
      </div>
      <dl>
        <div><dt>Status</dt><dd>${escapeHtml(row.status)}</dd></div>
        <div><dt>Registry</dt><dd>${escapeHtml(row.registry_validator_status)}</dd></div>
        <div><dt>Clone portable</dt><dd>${escapeHtml(row.clone_portable_validation_status)}</dd></div>
        <div><dt>Manifest</dt><dd>${escapeHtml(row.manifest_ref)}</dd></div>
        <div><dt>Preview</dt><dd>${escapeHtml(row.preview_ref)}</dd></div>
        <div><dt>Chain</dt><dd>${inlineList(row.chain_refs)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#multiCapsuleRelations").innerHTML = dashboard.resolved_by_links.map((relation) => `
    <article class="multi-capsule-card relation">
      <div class="protocol-card-head">
        <strong>${escapeHtml(relation.failure_sample_id)}</strong>
        <span>${escapeHtml(relation.relation_status)}</span>
      </div>
      <dl>
        <div><dt>Resolved by</dt><dd>${escapeHtml(relation.accepted_sample_id)}</dd></div>
        <div><dt>Failure route</dt><dd>${escapeHtml(relation.failure_final_route)}</dd></div>
        <div><dt>Failure tags</dt><dd>${inlineList(relation.failure_tags)}</dd></div>
        <div><dt>Failure manifest</dt><dd>${escapeHtml(relation.failure_manifest_ref)}</dd></div>
        <div><dt>Failure review</dt><dd>${escapeHtml(relation.failure_review_record_ref)}</dd></div>
        <div><dt>Accepted manifest</dt><dd>${escapeHtml(relation.accepted_manifest_ref || "missing")}</dd></div>
        <div><dt>Accepted import</dt><dd>${escapeHtml(relation.accepted_import_record_ref || "missing")}</dd></div>
        <div><dt>Accepted review</dt><dd>${escapeHtml(relation.accepted_review_record_ref || "missing")}</dd></div>
        <div><dt>Accepted approval</dt><dd>${escapeHtml(relation.accepted_approval_record_ref || "missing")}</dd></div>
        <div><dt>Reusable positive</dt><dd>${escapeHtml(relation.accepted_is_reusable_positive_example)}</dd></div>
        <div><dt>Failure never production</dt><dd>${escapeHtml(relation.failure_is_never_production)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#multiCapsuleGuard").innerHTML = `
    <span>static dashboard: ${escapeHtml(dashboard.guard.static_dashboard_only)}</span>
    <span>mock memory only: ${escapeHtml(dashboard.guard.mock_in_memory_only)}</span>
    <span>fetch: ${escapeHtml(dashboard.guard.fetch_performed)}</span>
    <span>file write: ${escapeHtml(dashboard.guard.file_write_performed)}</span>
    <span>asset archive read: ${escapeHtml(dashboard.guard.asset_archive_read_performed)}</span>
    <span>preview copy: ${escapeHtml(dashboard.guard.preview_creation_or_copy_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(dashboard.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function registryReportV2NegativeVisibilityState() {
  const seed = mock.registry_report_v2_negative_state_seed;
  return {
    phase: seed.phase,
    source_validator_phase: seed.source_validator_phase,
    source_validator_ref: seed.source_validator_ref,
    report_version: seed.report_version,
    status: seed.status,
    execution_mode: "review_console_static_registry_report_v2_negative_visibility_only",
    draft_output_key: seed.draft_output_key,
    baseline_totals: seed.baseline_totals,
    scenario_count: seed.scenario_count,
    scenario_ids: seed.scenario_ids,
    negative_state_classes: seed.negative_state_classes,
    scenarios: seed.scenarios.map((scenario) => ({
      scenario_id: scenario.scenario_id,
      failure_class: scenario.failure_class,
      severity: scenario.severity,
      affected_lane: scenario.affected_lane,
      affected_sample_ids: scenario.affected_sample_ids,
      expected_report_status: scenario.expected_report_status,
      visible_reason_cn: scenario.visible_reason_cn,
      reviewer_action_cn: scenario.reviewer_action_cn
    })),
    fail_closed_contract: seed.fail_closed_contract,
    guard: seed.guard
  };
}

function renderRegistryReportV2NegativeVisibility() {
  const stateView = registryReportV2NegativeVisibilityState();
  qs("#registryReportV2NegativeSummary").innerHTML = `
    <span>classes <strong>${escapeHtml(stateView.negative_state_classes.length)}</strong></span>
    <span>scenarios <strong>${escapeHtml(stateView.scenario_count)}</strong></span>
    <span>baseline <strong>${escapeHtml(`${stateView.baseline_totals.accepted}/${stateView.baseline_totals.failure}/${stateView.baseline_totals.total}`)}</strong></span>
    <span>green allowed <strong>${escapeHtml(stateView.fail_closed_contract.report_can_stay_green)}</strong></span>
  `;
  qs("#registryReportV2NegativeRows").innerHTML = stateView.scenarios.map((scenario) => `
    <article class="registry-report-v2-negative-card ${safeClassToken(scenario.severity)}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(scenario.failure_class)}</strong>
        <span>${escapeHtml(scenario.severity)}</span>
      </div>
      <dl>
        <div><dt>Scenario</dt><dd>${escapeHtml(scenario.scenario_id)}</dd></div>
        <div><dt>Lane</dt><dd>${escapeHtml(scenario.affected_lane)}</dd></div>
        <div><dt>Affected samples</dt><dd>${inlineList(scenario.affected_sample_ids)}</dd></div>
        <div><dt>Expected status</dt><dd>${escapeHtml(scenario.expected_report_status)}</dd></div>
        <div><dt>Visible reason</dt><dd>${escapeHtml(scenario.visible_reason_cn)}</dd></div>
        <div><dt>Reviewer action</dt><dd>${escapeHtml(scenario.reviewer_action_cn)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#registryReportV2NegativeGuard").innerHTML = `
    <span>static only: ${escapeHtml(stateView.guard.static_negative_state_view_only)}</span>
    <span>asset archive read: ${escapeHtml(stateView.guard.asset_archive_read_performed)}</span>
    <span>preview loaded: ${escapeHtml(stateView.guard.preview_loaded_or_rendered)}</span>
    <span>runtime proven: ${escapeHtml(stateView.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function registryReportV2State() {
  const dashboard = multiCapsuleDashboardState();
  const rows = dashboard.per_sample_report.map((row) => ({
    lane: row.lane,
    sample_id: row.sample_id,
    passed: row.passed,
    status: row.status,
    registry_validator_status: row.registry_validator_status,
    portable_validation_status: row.clone_portable_validation_status,
    manifest_ref: row.manifest_ref,
    preview_ref: row.preview_ref,
    chain_refs: row.chain_refs,
    resolved_by_accepted_sample: row.resolved_by_accepted_sample || null,
    failure_tags: row.failure_tags || [],
    failure_classes: []
  }));
  return {
    phase: "p6c_review_console_registry_report_v2_state",
    source_validator_phase: "p6b_capsule_registry_report_v2",
    report_version: "accepted_failure_capsule_registry_report_v2",
    status: "accepted_failure_capsule_registry_report_v2_verified",
    execution_mode: "review_console_static_registry_report_v2_state_only",
    draft_output_key: "registry_report_v2_state",
    source_reports: {
      accepted_registry_status: "registry_driven_preview_capsules_verified",
      accepted_registry_report_version: "v2",
      failure_registry_status: "failure_sample_capsules_verified",
      failure_registry_report_version: "v1"
    },
    totals: {
      accepted: dashboard.accepted_capsule_count,
      failure: dashboard.failure_capsule_count,
      total: dashboard.total_capsule_count,
      passed: rows.filter((row) => row.passed).length,
      failed: rows.filter((row) => !row.passed).length
    },
    accepted_sample_ids: dashboard.accepted_sample_ids,
    failure_sample_ids: dashboard.failure_sample_ids,
    per_sample_results: rows,
    resolved_by_links: dashboard.resolved_by_links,
    failure_class_summary: dashboard.failure_class_summary,
    report_fields: [
      "lane",
      "sample_id",
      "passed",
      "status",
      "registry_validator_status",
      "portable_validation_status",
      "manifest_ref",
      "preview_ref",
      "chain_refs",
      "resolved_by_accepted_sample",
      "failure_tags",
      "failure_classes"
    ],
    guard: {
      static_report_view_only: true,
      derived_from_static_capsule_mock: true,
      validator_output_represented: true,
      old_runs_source_required_for_portable_validation: false,
      fetch_performed: false,
      file_write_performed: false,
      asset_archive_read_performed: false,
      preview_loaded_or_rendered: false,
      preview_creation_or_copy_performed: false,
      accepted_samples_write_performed: false,
      failure_samples_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      production_candidate_write_performed: false,
      push_tag_release_deploy_performed: false,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderRegistryReportV2State() {
  const report = registryReportV2State();
  qs("#registryReportV2Summary").innerHTML = `
    <span>version <strong>${escapeHtml(report.report_version)}</strong></span>
    <span>status <strong>${escapeHtml(report.status)}</strong></span>
    <span>accepted <strong>${escapeHtml(report.totals.accepted)}</strong></span>
    <span>failure <strong>${escapeHtml(report.totals.failure)}</strong></span>
    <span>passed <strong>${escapeHtml(report.totals.passed)}</strong></span>
    <span>failed <strong>${escapeHtml(report.totals.failed)}</strong></span>
  `;
  qs("#registryReportV2Rows").innerHTML = report.per_sample_results.map((row) => `
    <article class="registry-report-v2-card ${row.lane}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.sample_id)}</strong>
        <span>${escapeHtml(row.lane)}</span>
      </div>
      <dl>
        <div><dt>Passed</dt><dd>${escapeHtml(row.passed)}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(row.status)}</dd></div>
        <div><dt>Registry</dt><dd>${escapeHtml(row.registry_validator_status)}</dd></div>
        <div><dt>Portable</dt><dd>${escapeHtml(row.portable_validation_status)}</dd></div>
        <div><dt>Manifest</dt><dd>${escapeHtml(row.manifest_ref)}</dd></div>
        <div><dt>Preview</dt><dd>${escapeHtml(row.preview_ref)}</dd></div>
        <div><dt>Chain</dt><dd>${inlineList(row.chain_refs)}</dd></div>
        <div><dt>Resolved by</dt><dd>${escapeHtml(row.resolved_by_accepted_sample || "none")}</dd></div>
        <div><dt>Failure tags</dt><dd>${inlineList(row.failure_tags)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#registryReportV2Relations").innerHTML = report.resolved_by_links.map((relation) => `
    <article class="registry-report-v2-card relation">
      <div class="protocol-card-head">
        <strong>${escapeHtml(relation.failure_sample_id)}</strong>
        <span>${escapeHtml(relation.relation_status)}</span>
      </div>
      <dl>
        <div><dt>Accepted sample</dt><dd>${escapeHtml(relation.accepted_sample_id)}</dd></div>
        <div><dt>Failure route</dt><dd>${escapeHtml(relation.failure_final_route)}</dd></div>
        <div><dt>Accepted reusable</dt><dd>${escapeHtml(relation.accepted_is_reusable_positive_example)}</dd></div>
        <div><dt>Failure never production</dt><dd>${escapeHtml(relation.failure_is_never_production)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#registryReportV2Guard").innerHTML = `
    <span>static view: ${escapeHtml(report.guard.static_report_view_only)}</span>
    <span>validator represented: ${escapeHtml(report.guard.validator_output_represented)}</span>
    <span>old runs required: ${escapeHtml(report.guard.old_runs_source_required_for_portable_validation)}</span>
    <span>fetch: ${escapeHtml(report.guard.fetch_performed)}</span>
    <span>file write: ${escapeHtml(report.guard.file_write_performed)}</span>
    <span>asset archive read: ${escapeHtml(report.guard.asset_archive_read_performed)}</span>
    <span>preview render: ${escapeHtml(report.guard.preview_loaded_or_rendered)}</span>
    <span>runtime proven: ${escapeHtml(report.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function artifactLifecycleReaderApi() {
  return window.ArtifactLifecycleStateReader;
}

function normalizeArtifactLifecycleState() {
  const api = artifactLifecycleReaderApi();
  if (!api || typeof api.normalizeArtifactLifecycleState !== "function") {
    return {
      parse_status: "blocked",
      errors: ["ArtifactLifecycleStateReader is not loaded"],
      records: [],
      counts: {
        total_records: 0,
        recoverable_accepted_sample_count: 0,
        blocked_registration_candidate_count: 0,
        remaining_full_recoverable_sample_gap: 3,
        hard_acceptance_three_full_samples_met: false,
        pending_candidate_counted_as_accepted: false
      },
      guard: {
        static_reader_only: true,
        fetch_performed: false,
        file_write_performed: false,
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        mcp_runtime_performed: false,
        DailyNote_write_performed: false,
        VCP_memory_write_performed: false,
        accepted_samples_write_performed: false,
        failure_samples_write_performed: false,
        production_candidate_write_performed: false,
        real_manifest_read_performed: false,
        real_vcpchat_read_performed: false,
        real_vcptoolbox_read_performed: false,
        vcp_runtime_integration_proven: false
      }
    };
  }
  return api.normalizeArtifactLifecycleState(state.artifact_lifecycle_state_reader);
}

const artifactEvidenceStatusPriority = {
  blocked_registration_candidate: 0,
  reviewed_pending_human_approval: 1,
  recoverable_accepted_sample: 2,
  recoverable: 2
};

function artifactEvidenceStatusKey(record) {
  if (record.registration_blocker || record.blocked_registration) return "blocked_registration_candidate";
  if (record.human_approval_status === "pending") return "reviewed_pending_human_approval";
  if (record.recoverable === true) return "recoverable_accepted_sample";
  return record.lifecycle_state || "unknown";
}

function artifactEvidenceSearchText(record) {
  return [
    record.sample_id,
    record.candidate_id,
    record.visual_task,
    record.lifecycle_state,
    record.human_approval_status,
    record.registration_blocker,
    record.artifact_ref,
    record.prompt_package_ref
  ].filter(Boolean).join(" ").toLowerCase();
}

function artifactEvidenceFilterRecords(records, filter, searchQuery = "") {
  const query = String(searchQuery || "").trim().toLowerCase();
  return records.filter((record) => {
    const statusMatches = filter === "recoverable"
      ? record.recoverable === true
      : filter === "blocked"
        ? record.blocked_registration === true
        : true;
    const searchMatches = !query || artifactEvidenceSearchText(record).includes(query);
    return statusMatches && searchMatches;
  });
}

function artifactLifecycleId(record) {
  return record.sample_id || record.candidate_id;
}

function artifactEvidenceStatusSortState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const ranked = lifecycle.records.map((record, index) => {
    const statusKey = artifactEvidenceStatusKey(record);
    return {
      artifact_id: record.sample_id || record.candidate_id,
      status_key: statusKey,
      sort_priority: artifactEvidenceStatusPriority[statusKey] ?? 9,
      registration_blocker: record.registration_blocker || null,
      recoverable: record.recoverable === true,
      original_index: index
    };
  });
  const sorted = ranked.slice().sort((left, right) => {
    if (left.sort_priority !== right.sort_priority) return left.sort_priority - right.sort_priority;
    return left.original_index - right.original_index;
  });
  return {
    draft_output_key: "artifact_evidence_status_sort_state",
    sort_mode: "blocked_candidates_first",
    sorted_artifact_ids: sorted.map((item) => item.artifact_id),
    blocked_candidate_first: sorted[0]?.registration_blocker === "human_approval_missing",
    blocked_candidate_artifact_id: sorted.find((item) => item.registration_blocker === "human_approval_missing")?.artifact_id || null,
    recoverable_count: ranked.filter((item) => item.recoverable).length,
    blocked_count: ranked.filter((item) => item.registration_blocker).length,
    hard_acceptance_three_full_samples_met: lifecycle.counts.hard_acceptance_three_full_samples_met,
    status_rows: sorted,
    static_sort_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function artifactEvidenceStatusSortFilterInteractionState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const sortState = artifactEvidenceStatusSortState();
  const sortedIdOrder = new Map(sortState.sorted_artifact_ids.map((id, index) => [id, index]));
  const selectedArtifactExists = lifecycle.records.some((record) => artifactLifecycleId(record) === state.selectedArtifactId);
  const currentVisibleRecords = artifactEvidenceFilterRecords(lifecycle.records, state.lifecycleFilter, state.lifecycleSearch);
  const selectedArtifactVisible = currentVisibleRecords.some((record) => artifactLifecycleId(record) === state.selectedArtifactId);
  const buildFilterResults = (searchQuery = "") => ["all", "recoverable", "blocked"].map((filter) => {
    const visible = artifactEvidenceFilterRecords(lifecycle.records, filter, searchQuery).slice().sort((left, right) => {
      const leftId = artifactLifecycleId(left);
      const rightId = artifactLifecycleId(right);
      return (sortedIdOrder.get(leftId) ?? 99) - (sortedIdOrder.get(rightId) ?? 99);
    });
    return {
      filter,
      visible_artifact_ids: visible.map((record) => artifactLifecycleId(record)),
      visible_count: visible.length,
      first_visible_artifact_id: visible[0] ? artifactLifecycleId(visible[0]) : null
    };
  });
  const filterResults = buildFilterResults();
  const searchFilterResults = buildFilterResults(state.lifecycleSearch);
  return {
    draft_output_key: "artifact_evidence_status_sort_filter_interaction_state",
    source_sort_key: "artifact_evidence_status_sort_state",
    sort_mode: sortState.sort_mode,
    filter_results: filterResults,
    search_filter_results: searchFilterResults,
    all_filter_blocked_candidate_first: filterResults.find((item) => item.filter === "all")?.first_visible_artifact_id === sortState.blocked_candidate_artifact_id,
    recoverable_filter_excludes_blocked_candidate: !filterResults.find((item) => item.filter === "recoverable")?.visible_artifact_ids.includes(sortState.blocked_candidate_artifact_id),
    blocked_filter_only_blocked_candidate: JSON.stringify(filterResults.find((item) => item.filter === "blocked")?.visible_artifact_ids || []) === JSON.stringify([sortState.blocked_candidate_artifact_id]),
    current_lifecycle_filter: state.lifecycleFilter,
    search_query: state.lifecycleSearch,
    selected_artifact_id: state.selectedArtifactId,
    selected_artifact_visible: selectedArtifactVisible,
    selected_artifact_hidden_by_current_filter: selectedArtifactExists && !selectedArtifactVisible,
    local_filter_only: true,
    static_interaction_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function renderArtifactLifecycleStateReader() {
  const lifecycle = normalizeArtifactLifecycleState();
  const counts = lifecycle.counts;
  const statusSort = artifactEvidenceStatusSortState();
  const sortedIdOrder = new Map(statusSort.sorted_artifact_ids.map((id, index) => [id, index]));
  const visibleRecords = artifactEvidenceFilterRecords(lifecycle.records, state.lifecycleFilter, state.lifecycleSearch).slice().sort((left, right) => {
    const leftId = artifactLifecycleId(left);
    const rightId = artifactLifecycleId(right);
    return (sortedIdOrder.get(leftId) ?? 99) - (sortedIdOrder.get(rightId) ?? 99);
  });
  const selectedArtifactExists = lifecycle.records.some((record) => artifactLifecycleId(record) === state.selectedArtifactId);
  const selectedArtifactVisible = visibleRecords.some((record) => artifactLifecycleId(record) === state.selectedArtifactId);
  const selectedArtifactHidden = selectedArtifactExists && !selectedArtifactVisible;
  const searchInput = qs("#artifactLifecycleSearch");
  if (searchInput && document.activeElement !== searchInput) {
    searchInput.value = state.lifecycleSearch;
  }
  qsa("[data-lifecycle-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lifecycleFilter === state.lifecycleFilter);
    button.setAttribute("aria-pressed", String(button.dataset.lifecycleFilter === state.lifecycleFilter));
  });
  qs("#artifactLifecycleSummary").innerHTML = `
    <span>parsed <strong>${escapeHtml(lifecycle.parse_status)}</strong></span>
    <span>visible <strong>${escapeHtml(`${visibleRecords.length}/${lifecycle.records.length}`)}</strong></span>
    <span>recoverable <strong>${escapeHtml(counts.recoverable_accepted_sample_count)}</strong></span>
    <span>blocked <strong>${escapeHtml(counts.blocked_registration_candidate_count)}</strong></span>
    <span>gap <strong>${escapeHtml(counts.remaining_full_recoverable_sample_gap)}</strong></span>
    <span>3-sample met <strong>${escapeHtml(counts.hard_acceptance_three_full_samples_met)}</strong></span>
    <span>sort <strong>${escapeHtml(statusSort.sort_mode)}</strong></span>
    <span>filter <strong>${escapeHtml(state.lifecycleFilter)}</strong></span>
    <span>search <strong>${escapeHtml(state.lifecycleSearch || "none")}</strong></span>
  `;

  const root = qs("#artifactLifecycleList");
  root.innerHTML = "";
  qs("#artifactLifecycleFilterNotice").innerHTML = selectedArtifactHidden
    ? `
      <div class="lifecycle-filter-notice-card">
        <span>当前选中样片 <strong>${escapeHtml(state.selectedArtifactId)}</strong> 已被筛选隐藏，详情仍保留在右侧上下文中。</span>
        <button id="clearLifecycleFiltersBtn" type="button">清除筛选</button>
      </div>
    `
    : "";
  const clearFiltersButton = qs("#clearLifecycleFiltersBtn");
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", clearLifecycleFilters);
  }
  if (visibleRecords.length === 0) {
    root.innerHTML = `
      <div class="artifact-lifecycle-empty" role="status">
        没有匹配的样片。筛选仍然只作用于当前静态 mock 数据，没有触发 fetch、文件写入或外部调用。
      </div>
    `;
  } else {
    visibleRecords.forEach((record) => {
      const artifactId = artifactLifecycleId(record);
      const card = document.createElement("article");
      card.className = `artifact-lifecycle-card ${record.recoverable ? "recoverable" : "blocked"}${artifactId === state.selectedArtifactId ? " is-selected" : ""}`;
      card.id = artifactLifecycleAnchorId(artifactId);
      card.tabIndex = 0;
      card.setAttribute("aria-selected", String(artifactId === state.selectedArtifactId));
      card.innerHTML = `
        <div class="protocol-card-head">
          <strong>${escapeHtml(artifactId)}</strong>
          <span>${escapeHtml(record.lifecycle_state)}</span>
        </div>
        <dl>
          <div><dt>Task</dt><dd>${escapeHtml(record.visual_task)}</dd></div>
          <div><dt>Approval</dt><dd>${escapeHtml(record.human_approval_status)}</dd></div>
          <div><dt>Recoverable</dt><dd>${escapeHtml(record.recoverable)}</dd></div>
          <div><dt>Blocker</dt><dd>${escapeHtml(record.registration_blocker || "none")}</dd></div>
          <div><dt>Artifact</dt><dd>${escapeHtml(record.artifact_ref)}</dd></div>
          <div><dt>Hash</dt><dd>${escapeHtml((record.sha256 || "").slice(0, 12))}</dd></div>
        </dl>
      `;
      card.addEventListener("click", () => setSelectedArtifact(artifactId));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelectedArtifact(artifactId);
        }
      });
      root.appendChild(card);
    });
  }

  qs("#artifactLifecycleGuard").innerHTML = `
    <span>static reader only: ${escapeHtml(lifecycle.guard.static_reader_only)}</span>
    <span>fetch: ${escapeHtml(lifecycle.guard.fetch_performed)}</span>
    <span>file write: ${escapeHtml(lifecycle.guard.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(lifecycle.guard.accepted_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(lifecycle.guard.production_candidate_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(lifecycle.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function setSelectedArtifact(id) {
  state.selectedArtifactId = id;
  renderArtifactLifecycleStateReader();
  renderArtifactDetailDrawer();
  renderArtifactEvidenceCompare();
  renderReviewSpineV11();
  renderDraft();
}

function setLifecycleFilter(filter) {
  state.lifecycleFilter = ["all", "recoverable", "blocked"].includes(filter) ? filter : "all";
  renderArtifactLifecycleStateReader();
  renderArtifactPromptCompletionPanel();
  renderDraft();
}

function setLifecycleSearch(value) {
  state.lifecycleSearch = String(value || "").trim();
  renderArtifactLifecycleStateReader();
  renderDraft();
}

function clearLifecycleFilters() {
  state.lifecycleFilter = "all";
  state.lifecycleSearch = "";
  renderArtifactLifecycleStateReader();
  renderArtifactPromptCompletionPanel();
  renderDraft();
}

function renderArtifactPromptCompletionPanel() {
  const lifecycle = normalizeArtifactLifecycleState();
  const records = lifecycle.records;
  const scoredRecords = records.filter((record) => typeof record.prompt_to_artifact_completion.score === "number");
  const average = scoredRecords.length
    ? Math.round(scoredRecords.reduce((sum, record) => sum + record.prompt_to_artifact_completion.score, 0) / scoredRecords.length)
    : 0;
  const blocked = records.filter((record) => record.prompt_to_artifact_completion.blocker);
  qs("#artifactPromptCompletionSummary").innerHTML = `
    <span>records <strong>${escapeHtml(records.length)}</strong></span>
    <span>average <strong>${escapeHtml(average)}</strong></span>
    <span>complete <strong>${escapeHtml(records.filter((record) => record.prompt_to_artifact_completion.status === "review_complete").length)}</strong></span>
    <span>blocked <strong>${escapeHtml(blocked.length)}</strong></span>
  `;

  const root = qs("#artifactPromptCompletionList");
  root.innerHTML = "";
  records.forEach((record) => {
    const completion = record.prompt_to_artifact_completion;
    const card = document.createElement("article");
    card.className = `artifact-prompt-completion-card ${completion.blocker ? "blocked" : "complete"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(record.sample_id || record.candidate_id)}</strong>
        <span>${escapeHtml(completion.score ?? "n/a")}</span>
      </div>
      <dl>
        <div><dt>Status</dt><dd>${escapeHtml(completion.status)}</dd></div>
        <div><dt>Blocker</dt><dd>${escapeHtml(completion.blocker || "none")}</dd></div>
        <div><dt>Prompt</dt><dd>${escapeHtml(record.prompt_package_ref)}</dd></div>
        <div><dt>Evidence</dt><dd>${inlineList(completion.evidence)}</dd></div>
      </dl>
    `;
    card.addEventListener("click", () => setSelectedArtifact(record.sample_id || record.candidate_id));
    root.appendChild(card);
  });

  qs("#artifactPromptCompletionGuard").innerHTML = `
    <span>static panel only: true</span>
    <span>fetch: false</span>
    <span>file write: false</span>
    <span>accepted_samples write: false</span>
    <span>production candidate: false</span>
    <span>VCP runtime proven: false</span>
  `;
}

function currentArtifactDetail() {
  const lifecycle = normalizeArtifactLifecycleState();
  return lifecycle.records.find((record) => record.sample_id === state.selectedArtifactId || record.candidate_id === state.selectedArtifactId) || lifecycle.records[0] || null;
}

function renderArtifactDetailDrawer() {
  const record = currentArtifactDetail();
  const body = qs("#artifactDetailBody");
  if (!record) {
    qs("#artifactDetailSummary").innerHTML = "<span>selected <strong>none</strong></span>";
    body.innerHTML = "";
    return;
  }
  qs("#artifactDetailSummary").innerHTML = `
    <span>selected <strong>${escapeHtml(record.sample_id || record.candidate_id)}</strong></span>
    <span>state <strong>${escapeHtml(record.lifecycle_state)}</strong></span>
    <span>approval <strong>${escapeHtml(record.human_approval_status)}</strong></span>
    <span>recoverable <strong>${escapeHtml(record.recoverable)}</strong></span>
  `;
  body.innerHTML = `
    <dl>
      <div><dt>Artifact</dt><dd>${escapeHtml(record.artifact_ref)}</dd></div>
      <div><dt>SHA256</dt><dd>${escapeHtml(record.sha256)}</dd></div>
      <div><dt>Dimensions</dt><dd>${escapeHtml(record.dimensions)}</dd></div>
      <div><dt>MIME</dt><dd>${escapeHtml(record.mime)}</dd></div>
      <div><dt>Prompt</dt><dd>${escapeHtml(record.prompt_package_ref)}</dd></div>
      <div><dt>Import record</dt><dd>${escapeHtml(record.import_record_ref)}</dd></div>
      <div><dt>Review record</dt><dd>${escapeHtml(record.review_record_ref)}</dd></div>
      <div><dt>Category index</dt><dd>${escapeHtml(record.category_index_ref)}</dd></div>
      <div><dt>Completion</dt><dd>${escapeHtml(record.prompt_to_artifact_completion.score ?? "n/a")} / ${escapeHtml(record.prompt_to_artifact_completion.status)}</dd></div>
      <div><dt>Blocker</dt><dd>${escapeHtml(record.registration_blocker || record.prompt_to_artifact_completion.blocker || "none")}</dd></div>
    </dl>
  `;
  qs("#artifactDetailGuard").innerHTML = `
    <span>static detail only: true</span>
    <span>selected id: ${escapeHtml(state.selectedArtifactId)}</span>
    <span>fetch: false</span>
    <span>file write: false</span>
    <span>accepted_samples write: false</span>
    <span>production candidate: false</span>
    <span>VCP runtime proven: false</span>
  `;
}

const artifactCompareFields = [
  ["lifecycle_state", "State"],
  ["human_approval_status", "Approval"],
  ["recoverable", "Recoverable"],
  ["artifact_ref", "Artifact"],
  ["sha256", "SHA256"],
  ["dimensions", "Dimensions"],
  ["prompt_package_ref", "Prompt"],
  ["review_record_ref", "Review"],
  ["category_index_ref", "Category"],
  ["registration_blocker", "Blocker"]
];

function artifactEvidenceCompareState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const primary = currentArtifactDetail();
  const comparison = lifecycle.records.find((record) => record.registration_blocker === "human_approval_missing") ||
    lifecycle.records.find((record) => (record.sample_id || record.candidate_id) !== state.selectedArtifactId) ||
    lifecycle.records[0] ||
    null;
  return {
    primary_artifact_id: primary ? (primary.sample_id || primary.candidate_id) : null,
    comparison_artifact_id: comparison ? (comparison.sample_id || comparison.candidate_id) : null,
    primary_artifact: primary,
    comparison_artifact: comparison,
    compare_fields: artifactCompareFields.map(([key]) => key),
    compared_field_count: artifactCompareFields.length,
    lamp_blocker: comparison?.registration_blocker || null,
    hard_acceptance_three_full_samples_met: lifecycle.counts.hard_acceptance_three_full_samples_met,
    compare_filter_lock: {
      locked_to_blocked_candidate: true,
      locked_blocker: "human_approval_missing",
      ignores_lifecycle_filter: true,
      current_lifecycle_filter: state.lifecycleFilter,
      locked_comparison_artifact_id: comparison ? (comparison.sample_id || comparison.candidate_id) : null,
      comparison_source: "blocked_registration_candidate"
    },
    static_compare_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    vcp_runtime_integration_proven: false
  };
}

function renderCompareCard(record, label) {
  if (!record) {
    return `
      <article class="artifact-compare-card blocked">
        <div class="protocol-card-head">
          <strong>${escapeHtml(label)}</strong>
          <span>missing</span>
        </div>
      </article>
    `;
  }
  return `
    <article class="artifact-compare-card ${record.registration_blocker ? "blocked" : "recoverable"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(record.lifecycle_state)}</span>
      </div>
      <dl>
        ${artifactCompareFields.map(([key, fieldLabel]) => `
          <div>
            <dt>${escapeHtml(fieldLabel)}</dt>
            <dd>${escapeHtml(record[key] ?? "none")}</dd>
          </div>
        `).join("")}
      </dl>
    </article>
  `;
}

function renderArtifactEvidenceCompare() {
  const compare = artifactEvidenceCompareState();
  qs("#artifactCompareSummary").innerHTML = `
    <span>primary <strong>${escapeHtml(compare.primary_artifact_id || "none")}</strong></span>
    <span>comparison <strong>${escapeHtml(compare.comparison_artifact_id || "none")}</strong></span>
    <span>fields <strong>${escapeHtml(compare.compared_field_count)}</strong></span>
    <span>lamp blocker <strong>${escapeHtml(compare.lamp_blocker || "none")}</strong></span>
    <span>filter lock <strong>${escapeHtml(compare.compare_filter_lock.locked_to_blocked_candidate)}</strong></span>
    <span>3-sample met <strong>${escapeHtml(compare.hard_acceptance_three_full_samples_met)}</strong></span>
  `;
  qs("#artifactCompareBody").innerHTML = `
    <div class="artifact-compare-grid">
      ${renderCompareCard(compare.primary_artifact, "Selected")}
      ${renderCompareCard(compare.comparison_artifact, "Blocked candidate")}
    </div>
  `;
  qs("#artifactCompareGuard").innerHTML = `
    <span>static compare only: ${escapeHtml(compare.static_compare_only)}</span>
    <span>fetch: ${escapeHtml(compare.fetch_performed)}</span>
    <span>file write: ${escapeHtml(compare.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(compare.accepted_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(compare.production_candidate_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(compare.vcp_runtime_integration_proven)}</span>
  `;
}

function artifactEvidenceReviewNotesState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const notes = lifecycle.records.map((record) => {
    const artifactId = record.sample_id || record.candidate_id;
    const blocker = record.registration_blocker || null;
    return {
      artifact_id: artifactId,
      visual_task: record.visual_task,
      review_record_ref: record.review_record_ref,
      human_approval_status: record.human_approval_status || "unknown",
      approved_by: record.approved_by || null,
      registration_blocker: blocker,
      review_note_summary: blocker
        ? "Blocked from accepted_samples registration until Jenn human approval exists."
        : "Approved recoverable sample with accepted_samples metadata registered.",
      accepted_samples_metadata_registered: record.accepted_samples_metadata_registered === true,
      production_candidate_status: record.production_candidate_status || "not_created"
    };
  });
  return {
    draft_output_key: "artifact_evidence_review_notes_state",
    note_count: notes.length,
    approved_note_count: notes.filter((note) => note.human_approval_status === "approved").length,
    pending_note_count: notes.filter((note) => note.human_approval_status === "pending").length,
    blocked_note_count: notes.filter((note) => note.registration_blocker).length,
    lamp_blocker: notes.find((note) => note.registration_blocker === "human_approval_missing")?.registration_blocker || null,
    notes,
    static_notes_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function renderArtifactEvidenceReviewNotes() {
  const reviewNotes = artifactEvidenceReviewNotesState();
  qs("#artifactReviewNotesSummary").innerHTML = `
    <span>notes <strong>${escapeHtml(reviewNotes.note_count)}</strong></span>
    <span>approved <strong>${escapeHtml(reviewNotes.approved_note_count)}</strong></span>
    <span>pending <strong>${escapeHtml(reviewNotes.pending_note_count)}</strong></span>
    <span>blocked <strong>${escapeHtml(reviewNotes.blocked_note_count)}</strong></span>
    <span>lamp blocker <strong>${escapeHtml(reviewNotes.lamp_blocker || "none")}</strong></span>
  `;
  qs("#artifactReviewNotesList").innerHTML = reviewNotes.notes.map((note) => `
    <article class="artifact-review-note-card ${note.registration_blocker ? "blocked" : "approved"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(note.artifact_id)}</strong>
        <span>${escapeHtml(note.human_approval_status)}</span>
      </div>
      <p>${escapeHtml(note.review_note_summary)}</p>
      <dl>
        <div><dt>Task</dt><dd>${escapeHtml(note.visual_task)}</dd></div>
        <div><dt>Review record</dt><dd>${escapeHtml(note.review_record_ref)}</dd></div>
        <div><dt>Approved by</dt><dd>${escapeHtml(note.approved_by || "none")}</dd></div>
        <div><dt>Registration blocker</dt><dd>${escapeHtml(note.registration_blocker || "none")}</dd></div>
        <div><dt>Accepted metadata</dt><dd>${escapeHtml(note.accepted_samples_metadata_registered)}</dd></div>
        <div><dt>Production candidate</dt><dd>${escapeHtml(note.production_candidate_status)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#artifactReviewNotesGuard").innerHTML = `
    <span>static notes only: ${escapeHtml(reviewNotes.static_notes_only)}</span>
    <span>fetch: ${escapeHtml(reviewNotes.fetch_performed)}</span>
    <span>file write: ${escapeHtml(reviewNotes.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(reviewNotes.accepted_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(reviewNotes.production_candidate_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(reviewNotes.vcp_runtime_integration_proven)}</span>
  `;
}

function threeSampleGapSummaryState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const counts = lifecycle.counts;
  const blockedCandidate = lifecycle.records.find((record) => record.registration_blocker === "human_approval_missing") || null;
  const requiredCount = 3;
  return {
    draft_output_key: "three_sample_gap_summary_state",
    required_full_recoverable_sample_count: requiredCount,
    recoverable_accepted_sample_count: counts.recoverable_accepted_sample_count,
    blocked_registration_candidate_count: counts.blocked_registration_candidate_count,
    remaining_full_recoverable_sample_gap: counts.remaining_full_recoverable_sample_gap,
    hard_acceptance_three_full_samples_met: counts.hard_acceptance_three_full_samples_met,
    pending_candidate_counted_as_accepted: counts.pending_candidate_counted_as_accepted,
    gap_status: counts.remaining_full_recoverable_sample_gap > 0 ? "blocked_by_human_approval_missing" : "met",
    blocker_candidate_id: blockedCandidate ? (blockedCandidate.sample_id || blockedCandidate.candidate_id) : null,
    blocker_reason: blockedCandidate?.registration_blocker || null,
    blocker_human_approval_status: blockedCandidate?.human_approval_status || null,
    blocker_accepted_samples_metadata_registered: blockedCandidate?.accepted_samples_metadata_registered === true,
    blocker_production_candidate_status: blockedCandidate?.production_candidate_status || "not_created",
    local_summary_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function renderThreeSampleGapSummary() {
  const gap = threeSampleGapSummaryState();
  qs("#threeSampleGapSummary").innerHTML = `
    <span>required <strong>${escapeHtml(gap.required_full_recoverable_sample_count)}</strong></span>
    <span>recoverable <strong>${escapeHtml(gap.recoverable_accepted_sample_count)}</strong></span>
    <span>remaining <strong>${escapeHtml(gap.remaining_full_recoverable_sample_gap)}</strong></span>
    <span>status <strong>${escapeHtml(gap.gap_status)}</strong></span>
    <span>met <strong>${escapeHtml(gap.hard_acceptance_three_full_samples_met)}</strong></span>
  `;
  qs("#threeSampleGapBody").innerHTML = `
    <article class="three-sample-gap-card ${gap.hard_acceptance_three_full_samples_met ? "met" : "blocked"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(gap.gap_status)}</strong>
        <span>${escapeHtml(gap.remaining_full_recoverable_sample_gap)} remaining</span>
      </div>
      <dl>
        <div><dt>Required recoverable samples</dt><dd>${escapeHtml(gap.required_full_recoverable_sample_count)}</dd></div>
        <div><dt>Current recoverable samples</dt><dd>${escapeHtml(gap.recoverable_accepted_sample_count)}</dd></div>
        <div><dt>Blocked candidate</dt><dd>${escapeHtml(gap.blocker_candidate_id || "none")}</dd></div>
        <div><dt>Blocker reason</dt><dd>${escapeHtml(gap.blocker_reason || "none")}</dd></div>
        <div><dt>Human approval</dt><dd>${escapeHtml(gap.blocker_human_approval_status || "none")}</dd></div>
        <div><dt>Accepted metadata</dt><dd>${escapeHtml(gap.blocker_accepted_samples_metadata_registered)}</dd></div>
        <div><dt>Production candidate</dt><dd>${escapeHtml(gap.blocker_production_candidate_status)}</dd></div>
        <div><dt>Pending counted as accepted</dt><dd>${escapeHtml(gap.pending_candidate_counted_as_accepted)}</dd></div>
      </dl>
    </article>
  `;
  qs("#threeSampleGapGuard").innerHTML = `
    <span>local summary only: ${escapeHtml(gap.local_summary_only)}</span>
    <span>fetch: ${escapeHtml(gap.fetch_performed)}</span>
    <span>file write: ${escapeHtml(gap.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(gap.accepted_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(gap.production_candidate_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(gap.vcp_runtime_integration_proven)}</span>
  `;
}

function recoverabilityMatrixState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const requiredFields = [
    "artifact_ref",
    "sha256",
    "dimensions",
    "mime",
    "prompt_package_ref",
    "import_record_ref",
    "review_record_ref",
    "human_approval_status",
    "category_index_ref",
    "accepted_registry_ref"
  ];
  const rows = lifecycle.records.map((record) => {
    const fieldState = {
      artifact_ref: Boolean(record.artifact_ref),
      sha256: Boolean(record.sha256),
      dimensions: Boolean(record.dimensions),
      mime: Boolean(record.mime),
      prompt_package_ref: Boolean(record.prompt_package_ref),
      import_record_ref: Boolean(record.import_record_ref),
      review_record_ref: Boolean(record.review_record_ref),
      human_approval_status: record.human_approval_status === "approved" && Boolean(record.approved_by),
      category_index_ref: Boolean(record.category_index_ref),
      accepted_registry_ref: Boolean(record.accepted_registry_ref)
    };
    const missing_fields = requiredFields.filter((field) => !fieldState[field]);
    const complete_recoverable =
      record.lifecycle_state === "recoverable" &&
      record.accepted_samples_metadata_registered === true &&
      record.accepted_samples_registration_eligible === true &&
      record.production_candidate_status === "not_created" &&
      record.registration_blocker === null &&
      missing_fields.length === 0;
    return {
      sample_id: record.sample_id,
      candidate_id: record.candidate_id,
      visual_task: record.visual_task,
      category: record.category,
      lifecycle_state: record.lifecycle_state,
      complete_recoverable,
      accepted_samples_metadata_registered: record.accepted_samples_metadata_registered === true,
      accepted_samples_registration_eligible: record.accepted_samples_registration_eligible === true,
      human_approval_status: record.human_approval_status,
      approved_by: record.approved_by || null,
      registration_blocker: record.registration_blocker || null,
      production_candidate_status: record.production_candidate_status || "not_created",
      prompt_to_artifact_status: record.prompt_to_artifact_completion?.status || null,
      field_state: fieldState,
      present_field_count: requiredFields.length - missing_fields.length,
      required_field_count: requiredFields.length,
      missing_fields,
      pending_counted_as_accepted: false,
      artifact_recoverability_is_not_vcp_runtime_integration: record.artifact_recoverability_is_not_vcp_runtime_integration === true,
      vcp_runtime_integration_proven: record.vcp_runtime_integration_proven === true
    };
  });
  const completeRows = rows.filter((row) => row.complete_recoverable);
  const blockedRows = rows.filter((row) => row.registration_blocker);
  return {
    draft_output_key: "recoverability_matrix_state",
    required_full_recoverable_sample_count: 3,
    complete_recoverable_sample_count: completeRows.length,
    blocked_registration_candidate_count: blockedRows.length,
    remaining_full_recoverable_sample_gap: Math.max(0, 3 - completeRows.length),
    hard_acceptance_three_full_samples_met: completeRows.length >= 3,
    pending_candidate_counted_as_accepted: false,
    matrix_status: completeRows.length >= 3 ? "three_sample_standard_met" : "blocked_by_human_approval_missing",
    rows,
    row_count: rows.length,
    required_fields: requiredFields,
    local_static_matrix_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    category_index_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    image_generation_performed: false,
    env_or_secret_read_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function renderRecoverabilityMatrix() {
  const matrix = recoverabilityMatrixState();
  qs("#recoverabilityMatrixSummary").innerHTML = `
    <span>complete <strong>${escapeHtml(matrix.complete_recoverable_sample_count)}</strong></span>
    <span>required <strong>${escapeHtml(matrix.required_full_recoverable_sample_count)}</strong></span>
    <span>remaining <strong>${escapeHtml(matrix.remaining_full_recoverable_sample_gap)}</strong></span>
    <span>status <strong>${escapeHtml(matrix.matrix_status)}</strong></span>
  `;
  qs("#recoverabilityMatrixBody").innerHTML = matrix.rows.map((row) => `
    <article class="recoverability-matrix-card ${row.complete_recoverable ? "complete" : "blocked"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.visual_task)}</strong>
        <span>${escapeHtml(row.lifecycle_state)}</span>
      </div>
      <dl>
        <div><dt>Sample</dt><dd>${escapeHtml(row.sample_id)}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(row.category)}</dd></div>
        <div><dt>Fields</dt><dd>${escapeHtml(row.present_field_count)} / ${escapeHtml(row.required_field_count)}</dd></div>
        <div><dt>Human approval</dt><dd>${escapeHtml(row.human_approval_status || "none")}</dd></div>
        <div><dt>Approved by</dt><dd>${escapeHtml(row.approved_by || "none")}</dd></div>
        <div><dt>Registration blocker</dt><dd>${escapeHtml(row.registration_blocker || "none")}</dd></div>
        <div><dt>Accepted metadata</dt><dd>${escapeHtml(row.accepted_samples_metadata_registered)}</dd></div>
        <div><dt>Complete recoverable</dt><dd>${escapeHtml(row.complete_recoverable)}</dd></div>
      </dl>
      <p>${escapeHtml(row.missing_fields.length ? `missing: ${row.missing_fields.join(", ")}` : "all required fields present")}</p>
    </article>
  `).join("");
  qs("#recoverabilityMatrixGuard").innerHTML = `
    <span>local static matrix only: ${escapeHtml(matrix.local_static_matrix_only)}</span>
    <span>fetch: ${escapeHtml(matrix.fetch_performed)}</span>
    <span>file write: ${escapeHtml(matrix.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(matrix.accepted_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(matrix.production_candidate_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(matrix.vcp_runtime_integration_proven)}</span>
  `;
}

function reviewConsoleSchemaBindingCoverageState() {
  const matrix = recoverabilityMatrixState();
  const boundSchemas = [
    {
      schema_key: "codex_session_image_import",
      schema_ref: "schemas/codex_session_image_import.schema.yaml",
      source_ref: "review_console/static_prototype/SCHEMA_BINDING.md",
      covered_fields: [
        "prompt_package_ref",
        "artifact_ref",
        "sha256",
        "dimensions",
        "mime",
        "import_record_ref",
        "review_record_ref"
      ]
    },
    {
      schema_key: "local_review_record",
      schema_ref: "schemas/local_review_record.schema.yaml",
      source_ref: "review_console/static_prototype/SCHEMA_BINDING.md",
      covered_fields: [
        "artifact_ref",
        "import_record_ref",
        "review_record_ref",
        "human_approval_status"
      ]
    },
    {
      schema_key: "accepted_sample_registry",
      schema_ref: "schemas/accepted_sample_registry.schema.yaml",
      source_ref: "review_console/static_prototype/SCHEMA_BINDING.md",
      covered_fields: [
        "artifact_ref",
        "sha256",
        "dimensions",
        "mime",
        "import_record_ref",
        "human_approval_status",
        "category_index_ref",
        "accepted_registry_ref"
      ]
    }
  ];
  const coveredFields = Array.from(new Set(boundSchemas.flatMap((schema) => schema.covered_fields))).sort();
  const missingFields = matrix.required_fields.filter((field) => !coveredFields.includes(field));
  return {
    phase: "v14_223_review_console_schema_binding_coverage_static_panel",
    execution_mode: "review_console_static_schema_binding_coverage_only",
    draft_output_key: "review_console_schema_binding_coverage_state",
    source_schema_binding_ref: "review_console/static_prototype/SCHEMA_BINDING.md",
    source_recoverability_matrix_ref: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
    bound_schema_count: boundSchemas.length,
    bound_schemas: boundSchemas,
    matrix_required_field_count: matrix.required_fields.length,
    covered_matrix_required_field_count: matrix.required_fields.length - missingFields.length,
    missing_matrix_required_fields: missingFields,
    binding_status: missingFields.length === 0 ? "covered_static_read_only" : "missing_schema_binding",
    schema_binding_coverage_complete: missingFields.length === 0,
    pending_candidate_counted_as_accepted: matrix.pending_candidate_counted_as_accepted,
    hard_acceptance_three_full_samples_met: matrix.hard_acceptance_three_full_samples_met,
    guard: {
      local_static_panel_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      category_index_write_performed: false,
      failure_samples_write_performed: false,
      production_candidate_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      mcp_runtime_performed: false,
      image_generation_performed: false,
      env_or_secret_read_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
      artifact_recoverability_is_not_vcp_runtime_integration: true,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderReviewConsoleSchemaBindingCoverage() {
  const coverage = reviewConsoleSchemaBindingCoverageState();
  qs("#schemaBindingCoverageSummary").innerHTML = `
    <span>schemas <strong>${escapeHtml(coverage.bound_schema_count)}</strong></span>
    <span>fields <strong>${escapeHtml(coverage.covered_matrix_required_field_count)} / ${escapeHtml(coverage.matrix_required_field_count)}</strong></span>
    <span>status <strong>${escapeHtml(coverage.binding_status)}</strong></span>
    <span>runtime <strong>${escapeHtml(coverage.guard.vcp_runtime_integration_proven)}</strong></span>
  `;
  qs("#schemaBindingCoverageBody").innerHTML = coverage.bound_schemas.map((schema) => `
    <article class="schema-binding-coverage-card">
      <div class="protocol-card-head">
        <strong>${escapeHtml(schema.schema_key)}</strong>
        <span>bound</span>
      </div>
      <dl>
        <div><dt>Schema</dt><dd>${escapeHtml(schema.schema_ref)}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(schema.source_ref)}</dd></div>
        <div><dt>Fields</dt><dd>${inlineList(schema.covered_fields)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#schemaBindingCoverageGuard").innerHTML = `
    <span>static panel: ${escapeHtml(coverage.guard.local_static_panel_only)}</span>
    <span>missing fields: ${inlineList(coverage.missing_matrix_required_fields)}</span>
    <span>accepted_samples write: ${escapeHtml(coverage.guard.accepted_samples_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(coverage.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function sixMonthGoalGapState() {
  const matrix = recoverabilityMatrixState();
  const schemaCoverage = reviewConsoleSchemaBindingCoverageState();
  const completeSamples = matrix.complete_recoverable_sample_count;
  const remainingGap = matrix.remaining_full_recoverable_sample_gap;
  const monthGoals = [
    {
      month: 1,
      objective: "three_full_recoverable_accepted_samples",
      status: matrix.hard_acceptance_three_full_samples_met ? "met" : "blocked_by_human_approval_missing",
      evidence_refs: [
        "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
        "tests/schema_examples/v14_222_review_console_recoverability_matrix_snapshot_static_regression.example.json",
        "docs/v14_166_lamp_v3_generated_candidate_readiness.md"
      ],
      proven_count: completeSamples,
      required_count: matrix.required_full_recoverable_sample_count,
      remaining_gap: remainingGap,
      blocker: remainingGap > 0 ? "human_approval_missing" : null,
      next_local_action: remainingGap > 0 ? "wait_for_jenn_human_approval_or_run_intake" : "expand_multi_category_matrix"
    },
    {
      month: 2,
      objective: "review_console_static_productization",
      status: "in_progress_static_read_only",
      evidence_refs: [
        "docs/v14_169_review_console_artifact_lifecycle_state_reader.md",
        "docs/v14_221_review_console_recoverability_matrix_static_workbench.md",
        "docs/v14_223_review_console_schema_binding_coverage_static_panel.md",
        "docs/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.md"
      ],
      proven_count: schemaCoverage.schema_binding_coverage_complete ? 1 : 0,
      required_count: 1,
      remaining_gap: schemaCoverage.schema_binding_coverage_complete ? 0 : 1,
      blocker: null,
      next_local_action: "continue_static_review_console_workbench_regression"
    },
    {
      month: 3,
      objective: "authorization_control_layer",
      status: "draft_preflight_contracts_present_not_executed",
      evidence_refs: [
        "docs/v14_195_authorization_package_compiler_contract_accepted_samples_registration.md",
        "docs/v14_196_authorization_package_compiler_type_matrix.md",
        "docs/v14_202_authorization_package_blocker_arbiter_contract.md"
      ],
      proven_count: 0,
      required_count: 1,
      remaining_gap: 1,
      blocker: "execution_requires_explicit_A5",
      next_local_action: "harden_authorization_package_compiler_validator"
    },
    {
      month: 4,
      objective: "vcp_dry_run_adapter_productization",
      status: "dry_run_contract_only",
      evidence_refs: [
        "docs/v14_203_authorization_compiler_review_console_handoff_state.md",
        "docs/v14_204_review_console_runtime_gap_dashboard_contract.md",
        "docs/v14_207_review_console_runtime_gap_trace_matrix_static_regression.md"
      ],
      proven_count: 0,
      required_count: 1,
      remaining_gap: 1,
      blocker: "real_runtime_integration_forbidden_without_A5",
      next_local_action: "expand_dry_run_contract_test_suite"
    },
    {
      month: 5,
      objective: "authorized_real_integration_pilot",
      status: "blocked_requires_jenn_A5",
      evidence_refs: [
        "docs/v14_197_manifest_read_authorization_compiler_output_preflight.md",
        "docs/v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.md"
      ],
      proven_count: 0,
      required_count: 1,
      remaining_gap: 1,
      blocker: "no_active_A5_authorization",
      next_local_action: "prepare_minimal_A5_preflight_only"
    },
    {
      month: 6,
      objective: "v1_visual_production_control_layer_closeout",
      status: "not_started_not_proven",
      evidence_refs: [],
      proven_count: 0,
      required_count: 1,
      remaining_gap: 1,
      blocker: "depends_on_month_1_to_5_evidence",
      next_local_action: "do_not_claim_v1_until_real_evidence_chain_exists"
    }
  ];
  const blockedGoals = monthGoals.filter((goal) => goal.remaining_gap > 0 || goal.blocker);
  return {
    phase: "v14_225_review_console_six_month_goal_gap_static_panel",
    execution_mode: "review_console_static_six_month_goal_gap_only",
    draft_output_key: "six_month_goal_gap_state",
    source_goal_ref: "thread_active_goal_2026_05_18",
    source_recoverability_matrix_ref: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
    source_schema_binding_snapshot_ref: "tests/schema_examples/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.example.json",
    month_count: monthGoals.length,
    blocked_or_incomplete_month_count: blockedGoals.length,
    complete_recoverable_sample_count: completeSamples,
    required_full_recoverable_sample_count: matrix.required_full_recoverable_sample_count,
    remaining_full_recoverable_sample_gap: remainingGap,
    hard_acceptance_three_full_samples_met: matrix.hard_acceptance_three_full_samples_met,
    pending_candidate_counted_as_accepted: matrix.pending_candidate_counted_as_accepted,
    vcp_runtime_integration_proven_month_count: 0,
    overall_status: matrix.hard_acceptance_three_full_samples_met ? "local_recoverability_baseline_expanding" : "month_1_blocked_by_third_sample_human_approval",
    goals: monthGoals,
    guard: {
      local_static_panel_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      category_index_write_performed: false,
      failure_samples_write_performed: false,
      production_candidate_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      mcp_runtime_performed: false,
      image_generation_performed: false,
      env_or_secret_read_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
      artifact_recoverability_is_not_vcp_runtime_integration: true,
      dry_run_adapter_is_not_vcp_runtime_integration: true,
      review_console_static_read_is_not_vcp_runtime_integration: true,
      authorization_package_draft_is_not_vcp_runtime_integration: true,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderSixMonthGoalGap() {
  const gap = sixMonthGoalGapState();
  qs("#sixMonthGoalGapSummary").innerHTML = `
    <span>months <strong>${escapeHtml(gap.month_count)}</strong></span>
    <span>samples <strong>${escapeHtml(gap.complete_recoverable_sample_count)} / ${escapeHtml(gap.required_full_recoverable_sample_count)}</strong></span>
    <span>remaining <strong>${escapeHtml(gap.remaining_full_recoverable_sample_gap)}</strong></span>
    <span>runtime proven <strong>${escapeHtml(gap.guard.vcp_runtime_integration_proven)}</strong></span>
  `;
  qs("#sixMonthGoalGapBody").innerHTML = gap.goals.map((goal) => `
    <article class="six-month-goal-gap-card ${goal.remaining_gap > 0 || goal.blocker ? "blocked" : "ready"}">
      <div class="protocol-card-head">
        <strong>Month ${escapeHtml(goal.month)} · ${escapeHtml(goal.objective)}</strong>
        <span>${escapeHtml(goal.status)}</span>
      </div>
      <dl>
        <div><dt>Proven</dt><dd>${escapeHtml(goal.proven_count)} / ${escapeHtml(goal.required_count)}</dd></div>
        <div><dt>Remaining gap</dt><dd>${escapeHtml(goal.remaining_gap)}</dd></div>
        <div><dt>Blocker</dt><dd>${escapeHtml(goal.blocker || "none")}</dd></div>
        <div><dt>Next local action</dt><dd>${escapeHtml(goal.next_local_action)}</dd></div>
        <div><dt>Evidence refs</dt><dd>${inlineList(goal.evidence_refs)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#sixMonthGoalGapGuard").innerHTML = `
    <span>static panel: ${escapeHtml(gap.guard.local_static_panel_only)}</span>
    <span>accepted_samples write: ${escapeHtml(gap.guard.accepted_samples_write_performed)}</span>
    <span>real manifest read: ${escapeHtml(gap.guard.real_manifest_read_performed)}</span>
    <span>VCPChat read: ${escapeHtml(gap.guard.real_vcpchat_read_performed)}</span>
    <span>runtime proven: ${escapeHtml(gap.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function thirdSampleAcceptanceReadinessState() {
  const lifecycle = normalizeArtifactLifecycleState();
  const target = lifecycle.records.find((record) => record.registration_blocker === "human_approval_missing") || null;
  const evidenceReferences = target ? [
    target.artifact_ref,
    target.sha256,
    target.dimensions,
    target.mime,
    target.prompt_package_ref,
    target.import_record_ref,
    target.review_record_ref,
    target.category_index_ref,
    target.accepted_registry_ref
  ].filter(Boolean) : [];
  const missingRequirements = [];
  if (target?.human_approval_status !== "approved") {
    missingRequirements.push("human_approval_status: approved");
  }
  if (target?.approved_by !== "Jenn") {
    missingRequirements.push("approved_by: Jenn");
  }
  const registrationReady = Boolean(target) && missingRequirements.length === 0 && target.accepted_samples_registration_eligible === true;
  return {
    draft_output_key: "third_sample_acceptance_readiness_state",
    target_sample_id: target?.sample_id || null,
    target_candidate_id: target?.candidate_id || null,
    target_visual_task: target?.visual_task || null,
    readiness_status: registrationReady ? "ready_for_metadata_registration_preflight" : "blocked_missing_human_approval",
    required_approval_by: "Jenn",
    human_approval_status: target?.human_approval_status || null,
    approved_by: target?.approved_by || null,
    registration_ready: registrationReady,
    accepted_samples_registration_eligible: target?.accepted_samples_registration_eligible === true,
    accepted_samples_metadata_registered: target?.accepted_samples_metadata_registered === true,
    accepted_samples_write_allowed: false,
    production_candidate_write_allowed: false,
    failure_samples_write_allowed: false,
    required_registry_files: [
      "accepted_samples/accepted_sample_registry.yaml",
      target?.category_index_ref || "accepted_samples/categories/product_still_life.yaml"
    ],
    evidence_refs: evidenceReferences,
    present_evidence_count: evidenceReferences.length,
    missing_requirements: missingRequirements,
    missing_requirement_count: missingRequirements.length,
    next_allowed_local_action: registrationReady ? "accepted_samples_metadata_registration_preflight" : "wait_for_jenn_human_approval",
    local_readiness_only: true,
    fetch_performed: false,
    file_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false
  };
}

function thirdSampleAcceptedSamplesAuthorizationPackageState() {
  const packageSeed = state.third_sample_authorization_package || {};
  const target = packageSeed.target || {};
  const scope = packageSeed.draft_scope || {};
  const guard = packageSeed.guard || {};
  const readiness = thirdSampleAcceptanceReadinessState();
  const allowedFiles = scope.would_modify_files || [];
  const forbiddenOperations = scope.forbidden_operations || [];
  const missingRequirements = packageSeed.missing_requirements || [];
  const exactStatement = packageSeed.exact_approval_statement_draft || "";
  return {
    draft_output_key: "third_sample_accepted_samples_authorization_package_state",
    source_authorization_package_ref: packageSeed.source_authorization_package_ref || null,
    source_readiness_ref: packageSeed.source_readiness_ref || null,
    source_blocker_preflight_ref: packageSeed.source_blocker_preflight_ref || null,
    target_sample_id: target.sample_id || readiness.target_sample_id,
    target_candidate_id: target.candidate_id || readiness.target_candidate_id,
    authorization_package_status: packageSeed.authorization_package_status || "missing",
    authorization_granted_by_this_record: packageSeed.authorization_granted_by_this_record === true,
    execution_ready: packageSeed.execution_ready === true,
    blocker: packageSeed.blocker || readiness.readiness_status,
    human_approval_status: target.human_approval_status || readiness.human_approval_status,
    approved_by: target.approved_by || null,
    registration_ready: target.registration_ready === true,
    accepted_samples_metadata_registered: readiness.accepted_samples_metadata_registered === true,
    exact_approval_statement_draft: exactStatement,
    exact_approval_statement_present: exactStatement.length > 0,
    exact_allowed_files: allowedFiles,
    exact_allowed_file_count: allowedFiles.length,
    forbidden_operations: forbiddenOperations,
    forbidden_operation_count: forbiddenOperations.length,
    missing_requirements: missingRequirements,
    missing_requirement_count: missingRequirements.length,
    next_allowed_local_action: "wait_for_jenn_human_approval_and_exact_authorization",
    static_panel_only: guard.static_panel_only === true,
    accepted_samples_write_performed: guard.accepted_samples_write_performed === true,
    category_index_write_performed: guard.category_index_write_performed === true,
    image_file_copy_performed: guard.image_file_copy_performed === true,
    failure_samples_write_performed: guard.failure_samples_write_performed === true,
    production_candidate_write_performed: guard.production_candidate_write_performed === true,
    DailyNote_write_performed: guard.DailyNote_write_performed === true,
    VCP_memory_write_performed: guard.VCP_memory_write_performed === true,
    provider_contact_performed: guard.provider_contact_performed === true,
    plugin_call_performed: guard.plugin_call_performed === true,
    api_call_performed: guard.api_call_performed === true,
    mcp_runtime_performed: guard.mcp_runtime_performed === true,
    real_manifest_read_performed: guard.real_manifest_read_performed === true,
    real_vcpchat_read_performed: guard.real_vcpchat_read_performed === true,
    real_vcptoolbox_read_performed: guard.real_vcptoolbox_read_performed === true,
    push_tag_release_deploy_performed: guard.push_tag_release_deploy_performed === true,
    artifact_recoverability_is_not_vcp_runtime_integration: guard.artifact_recoverability_is_not_vcp_runtime_integration === true,
    vcp_runtime_integration_proven: guard.vcp_runtime_integration_proven === true
  };
}

function thirdSamplePostApprovalGateState() {
  const gateSeed = state.third_sample_post_approval_gate || {};
  const target = gateSeed.target || {};
  const guard = gateSeed.guard || {};
  const requirements = gateSeed.required_before_write || [];
  const authorization = thirdSampleAcceptedSamplesAuthorizationPackageState();
  return {
    draft_output_key: "third_sample_post_approval_gate_state",
    source_gate_ref: gateSeed.source_gate_ref || null,
    source_intake_validator_ref: gateSeed.source_intake_validator_ref || null,
    target_sample_id: target.sample_id || authorization.target_sample_id,
    target_candidate_id: target.candidate_id || authorization.target_candidate_id,
    category: target.category || "product_still_life",
    gate_status: gateSeed.gate_status || "missing",
    blocker: gateSeed.blocker || authorization.blocker,
    approval_statement_source_is_user_submission: target.approval_statement_source_is_user_submission === true,
    human_approval_captured_now: target.human_approval_captured_now === true,
    accepted_samples_registration_ready_now: target.accepted_samples_registration_ready_now === true,
    future_registration_requires_v14_214_user_submission: target.future_registration_requires_v14_214_user_submission === true,
    authorization_package_status: authorization.authorization_package_status,
    authorization_execution_ready: authorization.execution_ready,
    required_before_write: requirements,
    required_before_write_count: requirements.length,
    next_allowed_local_action: "wait_for_jenn_human_approval_then_revalidate_intake_gate",
    static_panel_only: guard.static_panel_only === true,
    accepted_samples_write_performed: guard.accepted_samples_write_performed === true,
    category_index_write_performed: guard.category_index_write_performed === true,
    image_file_copy_performed: guard.image_file_copy_performed === true,
    runs_source_image_modified: guard.runs_source_image_modified === true,
    failure_samples_write_performed: guard.failure_samples_write_performed === true,
    production_candidate_write_performed: guard.production_candidate_write_performed === true,
    DailyNote_write_performed: guard.DailyNote_write_performed === true,
    VCP_memory_write_performed: guard.VCP_memory_write_performed === true,
    provider_contact_performed: guard.provider_contact_performed === true,
    plugin_call_performed: guard.plugin_call_performed === true,
    api_call_performed: guard.api_call_performed === true,
    mcp_runtime_performed: guard.mcp_runtime_performed === true,
    image_generation_performed: guard.image_generation_performed === true,
    env_or_secret_read_performed: guard.env_or_secret_read_performed === true,
    real_manifest_read_performed: guard.real_manifest_read_performed === true,
    real_vcpchat_read_performed: guard.real_vcpchat_read_performed === true,
    real_vcptoolbox_read_performed: guard.real_vcptoolbox_read_performed === true,
    push_tag_release_deploy_performed: guard.push_tag_release_deploy_performed === true,
    artifact_recoverability_is_not_vcp_runtime_integration: guard.artifact_recoverability_is_not_vcp_runtime_integration === true,
    vcp_runtime_integration_proven: guard.vcp_runtime_integration_proven === true
  };
}

function humanApprovalBlockerQueueState() {
  const queueSeed = state.human_approval_blocker_queue || {};
  const guard = queueSeed.guard || {};
  const blockers = (queueSeed.blockers || []).map((blocker) => ({
    blocker_id: blocker.blocker_id || "missing_blocker_id",
    blocker_type: blocker.blocker_type || "missing_blocker_type",
    severity: blocker.severity || "unknown",
    target_sample_id: blocker.target_sample_id || null,
    target_candidate_id: blocker.target_candidate_id || null,
    target_category: blocker.target_category || null,
    required_evidence_count: blocker.required_evidence_count || 0,
    required_evidence: blocker.required_evidence || [],
    approval_statement_source_is_user_submission: blocker.approval_statement_source_is_user_submission === true,
    human_approval_captured_now: blocker.human_approval_captured_now === true,
    accepted_samples_registration_ready_now: blocker.accepted_samples_registration_ready_now === true,
    next_allowed_local_action: blocker.next_allowed_local_action || "wait_for_human_approval",
    next_write_action_allowed_now: blocker.next_write_action_allowed_now === true
  }));
  return {
    draft_output_key: "human_approval_blocker_queue_state",
    phase: queueSeed.phase || "missing",
    source_snapshot_ref: queueSeed.source_snapshot_ref || null,
    source_panel_ref: queueSeed.source_panel_ref || null,
    source_gate_ref: queueSeed.source_gate_ref || null,
    source_intake_validator_ref: queueSeed.source_intake_validator_ref || null,
    queue_status: queueSeed.queue_status || "missing",
    total_blockers: queueSeed.total_blockers || blockers.length,
    blockers,
    static_panel_only: guard.static_panel_only === true,
    read_only_queue: guard.read_only_queue === true,
    approval_capture_performed: guard.approval_capture_performed === true,
    accepted_samples_write_performed: guard.accepted_samples_write_performed === true,
    category_index_write_performed: guard.category_index_write_performed === true,
    image_file_copy_performed: guard.image_file_copy_performed === true,
    runs_source_image_modified: guard.runs_source_image_modified === true,
    failure_samples_write_performed: guard.failure_samples_write_performed === true,
    production_candidate_write_performed: guard.production_candidate_write_performed === true,
    DailyNote_write_performed: guard.DailyNote_write_performed === true,
    VCP_memory_write_performed: guard.VCP_memory_write_performed === true,
    provider_contact_performed: guard.provider_contact_performed === true,
    plugin_call_performed: guard.plugin_call_performed === true,
    api_call_performed: guard.api_call_performed === true,
    mcp_runtime_performed: guard.mcp_runtime_performed === true,
    image_generation_performed: guard.image_generation_performed === true,
    env_or_secret_read_performed: guard.env_or_secret_read_performed === true,
    real_manifest_read_performed: guard.real_manifest_read_performed === true,
    real_vcpchat_read_performed: guard.real_vcpchat_read_performed === true,
    real_vcptoolbox_read_performed: guard.real_vcptoolbox_read_performed === true,
    push_tag_release_deploy_performed: guard.push_tag_release_deploy_performed === true,
    artifact_recoverability_is_not_vcp_runtime_integration: guard.artifact_recoverability_is_not_vcp_runtime_integration === true,
    vcp_runtime_integration_proven: guard.vcp_runtime_integration_proven === true
  };
}

function exactNewTrial003FormalHumanApprovalCaptureSurfaceState() {
  const seed = state.exact_new_trial_003_formal_human_approval_capture_surface || {};
  const target = seed.target || {};
  const current = seed.current_evidence_state || {};
  const guard = seed.guard || {};
  const captureFields = (seed.capture_fields || []).map((field) => ({
    field_id: field.field_id || "missing_field_id",
    label: field.label || field.field_id || "missing_label",
    required: field.required === true,
    current_value_present: field.current_value_present === true,
    accepted_source: field.accepted_source || "missing_accepted_source"
  }));
  return {
    draft_output_key: "exact_new_trial_003_formal_human_approval_capture_surface_state",
    phase: seed.phase || "missing",
    source_packet_ref: seed.source_packet_ref || null,
    source_report_ref: seed.source_report_ref || null,
    source_review_ref: seed.source_review_ref || null,
    capture_surface_status: seed.capture_surface_status || "missing",
    target_candidate_id: target.candidate_id || null,
    target_sample_id: target.sample_id || null,
    target_category: target.category || null,
    artifact_ref: target.artifact_ref || null,
    sha256: target.sha256 || null,
    dimensions: target.dimensions || null,
    mime: target.mime || null,
    reviewer_required: target.reviewer_required || "Jenn",
    capture_fields: captureFields,
    required_capture_field_count: captureFields.filter((field) => field.required).length,
    present_capture_field_count: captureFields.filter((field) => field.current_value_present).length,
    required_statement_tokens: seed.required_statement_tokens || [],
    boundary_acknowledgement_items: seed.boundary_acknowledgement_items || [],
    approval_evidence_present_now: current.approval_evidence_present_now === true,
    approval_statement_text_present_now: current.approval_statement_text_present_now === true,
    approval_statement_source_is_user_submission: current.approval_statement_source_is_user_submission === true,
    formal_human_approval_status: current.formal_human_approval_status || "pending",
    formal_human_approval_captured_now: current.formal_human_approval_captured_now === true,
    accepted_samples_registration_ready_now: current.accepted_samples_registration_ready_now === true,
    registration_unlock_allowed_now: current.registration_unlock_allowed_now === true,
    next_write_action_allowed_now: current.next_write_action_allowed_now === true,
    current_blocker: current.current_blocker || "formal_human_approval_evidence_missing",
    next_allowed_local_action: seed.next_allowed_local_action || "wait_for_jenn_user_submission_then_validate",
    static_panel_only: guard.static_panel_only === true,
    read_only_capture_surface: guard.read_only_capture_surface === true,
    approval_capture_performed: guard.approval_capture_performed === true,
    approval_evidence_fabricated: guard.approval_evidence_fabricated === true,
    accepted_samples_write_performed: guard.accepted_samples_write_performed === true,
    archive_write_performed: guard.archive_write_performed === true,
    category_index_write_performed: guard.category_index_write_performed === true,
    image_file_copy_performed: guard.image_file_copy_performed === true,
    runs_source_image_modified: guard.runs_source_image_modified === true,
    failure_samples_write_performed: guard.failure_samples_write_performed === true,
    production_candidate_write_performed: guard.production_candidate_write_performed === true,
    DailyNote_write_performed: guard.DailyNote_write_performed === true,
    VCP_memory_write_performed: guard.VCP_memory_write_performed === true,
    provider_contact_performed: guard.provider_contact_performed === true,
    plugin_call_performed: guard.plugin_call_performed === true,
    api_call_performed: guard.api_call_performed === true,
    mcp_runtime_performed: guard.mcp_runtime_performed === true,
    image_generation_performed: guard.image_generation_performed === true,
    secret_value_read_performed: guard.secret_value_read_performed === true,
    env_or_secret_read_performed: guard.env_or_secret_read_performed === true,
    real_manifest_read_performed: guard.real_manifest_read_performed === true,
    real_vcpchat_read_performed: guard.real_vcpchat_read_performed === true,
    real_vcptoolbox_read_performed: guard.real_vcptoolbox_read_performed === true,
    staging_performed: guard.staging_performed === true,
    commit_performed: guard.commit_performed === true,
    push_tag_release_deploy_performed: guard.push_tag_release_deploy_performed === true,
    artifact_recoverability_is_not_vcp_runtime_integration: guard.artifact_recoverability_is_not_vcp_runtime_integration === true,
    vcp_runtime_integration_proven: guard.vcp_runtime_integration_proven === true
  };
}

function renderThirdSampleAcceptanceReadiness() {
  const readiness = thirdSampleAcceptanceReadinessState();
  qs("#thirdSampleReadinessSummary").innerHTML = `
    <span>status <strong>${escapeHtml(readiness.readiness_status)}</strong></span>
    <span>approval <strong>${escapeHtml(readiness.human_approval_status || "missing")}</strong></span>
    <span>missing <strong>${escapeHtml(readiness.missing_requirement_count)}</strong></span>
    <span>write allowed <strong>${escapeHtml(readiness.accepted_samples_write_allowed)}</strong></span>
  `;
  qs("#thirdSampleReadinessBody").innerHTML = `
    <article class="third-sample-readiness-card ${readiness.registration_ready ? "ready" : "blocked"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(readiness.target_sample_id || "no blocked target")}</strong>
        <span>${escapeHtml(readiness.next_allowed_local_action)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(readiness.target_candidate_id || "none")}</dd></div>
        <div><dt>Visual task</dt><dd>${escapeHtml(readiness.target_visual_task || "none")}</dd></div>
        <div><dt>Required approval</dt><dd>${escapeHtml(readiness.required_approval_by)}</dd></div>
        <div><dt>Approved by</dt><dd>${escapeHtml(readiness.approved_by || "none")}</dd></div>
        <div><dt>Registration ready</dt><dd>${escapeHtml(readiness.registration_ready)}</dd></div>
        <div><dt>Metadata registered</dt><dd>${escapeHtml(readiness.accepted_samples_metadata_registered)}</dd></div>
        <div><dt>Evidence refs</dt><dd>${escapeHtml(readiness.present_evidence_count)}</dd></div>
        <div><dt>Missing requirements</dt><dd>${escapeHtml(readiness.missing_requirements.join("; ") || "none")}</dd></div>
      </dl>
    </article>
  `;
  qs("#thirdSampleReadinessGuard").innerHTML = `
    <span>local readiness only: ${escapeHtml(readiness.local_readiness_only)}</span>
    <span>fetch: ${escapeHtml(readiness.fetch_performed)}</span>
    <span>file write: ${escapeHtml(readiness.file_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(readiness.accepted_samples_write_performed)}</span>
    <span>accepted_samples write allowed: ${escapeHtml(readiness.accepted_samples_write_allowed)}</span>
    <span>production candidate allowed: ${escapeHtml(readiness.production_candidate_write_allowed)}</span>
    <span>VCP runtime proven: ${escapeHtml(readiness.vcp_runtime_integration_proven)}</span>
  `;
}

function renderThirdSamplePostApprovalGate() {
  const gate = thirdSamplePostApprovalGateState();
  qs("#thirdSamplePostApprovalGateSummary").innerHTML = `
    <span>status <strong>${escapeHtml(gate.gate_status)}</strong></span>
    <span>blocker <strong>${escapeHtml(gate.blocker)}</strong></span>
    <span>user submission <strong>${escapeHtml(gate.approval_statement_source_is_user_submission)}</strong></span>
    <span>ready <strong>${escapeHtml(gate.accepted_samples_registration_ready_now)}</strong></span>
  `;
  qs("#thirdSamplePostApprovalGateBody").innerHTML = `
    <article class="third-sample-post-approval-gate-card blocked">
      <div class="protocol-card-head">
        <strong>${escapeHtml(gate.target_sample_id || "no target sample")}</strong>
        <span>${escapeHtml(gate.next_allowed_local_action)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(gate.target_candidate_id || "none")}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(gate.category)}</dd></div>
        <div><dt>Intake validator</dt><dd>${escapeHtml(gate.source_intake_validator_ref || "none")}</dd></div>
        <div><dt>Human approval captured</dt><dd>${escapeHtml(gate.human_approval_captured_now)}</dd></div>
        <div><dt>Requires v14.214 user submission</dt><dd>${escapeHtml(gate.future_registration_requires_v14_214_user_submission)}</dd></div>
        <div><dt>Authorization status</dt><dd>${escapeHtml(gate.authorization_package_status)}</dd></div>
        <div><dt>Required before write</dt><dd>${escapeHtml(gate.required_before_write.join("; ") || "none")}</dd></div>
      </dl>
    </article>
  `;
  qs("#thirdSamplePostApprovalGateGuard").innerHTML = `
    <span>static panel only: ${escapeHtml(gate.static_panel_only)}</span>
    <span>accepted_samples write: ${escapeHtml(gate.accepted_samples_write_performed)}</span>
    <span>category write: ${escapeHtml(gate.category_index_write_performed)}</span>
    <span>image copy: ${escapeHtml(gate.image_file_copy_performed)}</span>
    <span>runs modified: ${escapeHtml(gate.runs_source_image_modified)}</span>
    <span>production candidate: ${escapeHtml(gate.production_candidate_write_performed)}</span>
    <span>DailyNote/VCP memory: ${escapeHtml(gate.DailyNote_write_performed || gate.VCP_memory_write_performed)}</span>
    <span>provider/API/plugin/MCP: ${escapeHtml(gate.provider_contact_performed || gate.api_call_performed || gate.plugin_call_performed || gate.mcp_runtime_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(gate.vcp_runtime_integration_proven)}</span>
  `;
}

function renderHumanApprovalBlockerQueue() {
  const queue = humanApprovalBlockerQueueState();
  qs("#humanApprovalBlockerQueueSummary").innerHTML = `
    <span>status <strong>${escapeHtml(queue.queue_status)}</strong></span>
    <span>blockers <strong>${escapeHtml(queue.total_blockers)}</strong></span>
    <span>read only <strong>${escapeHtml(queue.read_only_queue)}</strong></span>
    <span>approval captured <strong>${escapeHtml(queue.approval_capture_performed)}</strong></span>
  `;
  qs("#humanApprovalBlockerQueueBody").innerHTML = queue.blockers
    .map((blocker) => `
      <article id="${escapeHtml(humanApprovalBlockerAnchorId(blocker))}" class="human-approval-blocker-queue-card blocked" tabindex="-1">
        <div class="protocol-card-head">
          <strong>${escapeHtml(blocker.target_sample_id || "no blocked sample")}</strong>
          <span>${escapeHtml(blocker.severity)}</span>
        </div>
        <dl>
          <div><dt>Blocker</dt><dd>${escapeHtml(blocker.blocker_type)}</dd></div>
          <div><dt>Candidate</dt><dd>${escapeHtml(blocker.target_candidate_id || "none")}</dd></div>
          <div><dt>Category</dt><dd>${escapeHtml(blocker.target_category || "none")}</dd></div>
          <div><dt>Required evidence</dt><dd>${escapeHtml(blocker.required_evidence_count)}</dd></div>
          <div><dt>User submission</dt><dd>${escapeHtml(blocker.approval_statement_source_is_user_submission)}</dd></div>
          <div><dt>Approval captured</dt><dd>${escapeHtml(blocker.human_approval_captured_now)}</dd></div>
          <div><dt>Registration ready</dt><dd>${escapeHtml(blocker.accepted_samples_registration_ready_now)}</dd></div>
          <div><dt>Write allowed now</dt><dd>${escapeHtml(blocker.next_write_action_allowed_now)}</dd></div>
          <div><dt>Next local action</dt><dd>${escapeHtml(blocker.next_allowed_local_action)}</dd></div>
          <div><dt>Evidence checklist</dt><dd>${escapeHtml(blocker.required_evidence.join("; ") || "none")}</dd></div>
        </dl>
      </article>
    `)
    .join("");
  qs("#humanApprovalBlockerQueueGuard").innerHTML = `
    <span>static panel only: ${escapeHtml(queue.static_panel_only)}</span>
    <span>read-only queue: ${escapeHtml(queue.read_only_queue)}</span>
    <span>accepted_samples write: ${escapeHtml(queue.accepted_samples_write_performed)}</span>
    <span>category write: ${escapeHtml(queue.category_index_write_performed)}</span>
    <span>approval capture: ${escapeHtml(queue.approval_capture_performed)}</span>
    <span>production candidate: ${escapeHtml(queue.production_candidate_write_performed)}</span>
    <span>DailyNote/VCP memory: ${escapeHtml(queue.DailyNote_write_performed || queue.VCP_memory_write_performed)}</span>
    <span>provider/API/plugin/MCP: ${escapeHtml(queue.provider_contact_performed || queue.api_call_performed || queue.plugin_call_performed || queue.mcp_runtime_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(queue.vcp_runtime_integration_proven)}</span>
  `;
}

function renderExactNewTrial003FormalHumanApprovalCaptureSurface() {
  const surface = exactNewTrial003FormalHumanApprovalCaptureSurfaceState();
  qs("#exactNewTrial003ApprovalCaptureSummary").innerHTML = `
    <span>status <strong>${escapeHtml(surface.capture_surface_status)}</strong></span>
    <span>reviewer <strong>${escapeHtml(surface.reviewer_required)}</strong></span>
    <span>approval captured <strong>${escapeHtml(surface.formal_human_approval_captured_now)}</strong></span>
    <span>write allowed <strong>${escapeHtml(surface.next_write_action_allowed_now)}</strong></span>
  `;
  qs("#exactNewTrial003ApprovalCaptureBody").innerHTML = `
    <article class="exact-new-trial-approval-capture-card blocked">
      <div class="protocol-card-head">
        <strong>${escapeHtml(surface.target_sample_id || "no target sample")}</strong>
        <span>${escapeHtml(surface.next_allowed_local_action)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(surface.target_candidate_id || "none")}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(surface.target_category || "none")}</dd></div>
        <div><dt>Artifact</dt><dd>${escapeHtml(surface.artifact_ref || "none")}</dd></div>
        <div><dt>SHA-256</dt><dd>${escapeHtml(surface.sha256 || "none")}</dd></div>
        <div><dt>Dimensions</dt><dd>${escapeHtml(surface.dimensions || "none")}</dd></div>
        <div><dt>Current blocker</dt><dd>${escapeHtml(surface.current_blocker)}</dd></div>
        <div><dt>Required fields</dt><dd>${escapeHtml(surface.required_capture_field_count)}</dd></div>
        <div><dt>Present fields</dt><dd>${escapeHtml(surface.present_capture_field_count)}</dd></div>
      </dl>
      <div class="exact-new-trial-approval-capture-fields">
        ${surface.capture_fields.map((field) => `
          <span>
            <strong>${escapeHtml(field.label)}</strong>
            required ${escapeHtml(field.required)} | present ${escapeHtml(field.current_value_present)} | source ${escapeHtml(field.accepted_source)}
          </span>
        `).join("")}
      </div>
      <div class="exact-new-trial-approval-capture-fields">
        ${surface.boundary_acknowledgement_items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </article>
  `;
  qs("#exactNewTrial003ApprovalCaptureGuard").innerHTML = `
    <span>static panel only: ${escapeHtml(surface.static_panel_only)}</span>
    <span>read-only capture: ${escapeHtml(surface.read_only_capture_surface)}</span>
    <span>approval capture: ${escapeHtml(surface.approval_capture_performed)}</span>
    <span>fabricated evidence: ${escapeHtml(surface.approval_evidence_fabricated)}</span>
    <span>accepted_samples write: ${escapeHtml(surface.accepted_samples_write_performed)}</span>
    <span>archive write: ${escapeHtml(surface.archive_write_performed)}</span>
    <span>production candidate: ${escapeHtml(surface.production_candidate_write_performed)}</span>
    <span>DailyNote/VCP memory: ${escapeHtml(surface.DailyNote_write_performed || surface.VCP_memory_write_performed)}</span>
    <span>provider/API/plugin/MCP: ${escapeHtml(surface.provider_contact_performed || surface.api_call_performed || surface.plugin_call_performed || surface.mcp_runtime_performed)}</span>
    <span>image generation: ${escapeHtml(surface.image_generation_performed)}</span>
    <span>secret read: ${escapeHtml(surface.secret_value_read_performed || surface.env_or_secret_read_performed)}</span>
    <span>stage/commit/push: ${escapeHtml(surface.staging_performed || surface.commit_performed || surface.push_tag_release_deploy_performed)}</span>
  `;
}

function renderThirdSampleAcceptedSamplesAuthorizationPackage() {
  const packageState = thirdSampleAcceptedSamplesAuthorizationPackageState();
  qs("#thirdSampleAuthorizationPackageSummary").innerHTML = `
    <span>status <strong>${escapeHtml(packageState.authorization_package_status)}</strong></span>
    <span>granted <strong>${escapeHtml(packageState.authorization_granted_by_this_record)}</strong></span>
    <span>execution <strong>${escapeHtml(packageState.execution_ready)}</strong></span>
    <span>blocker <strong>${escapeHtml(packageState.blocker)}</strong></span>
  `;
  qs("#thirdSampleAuthorizationPackageBody").innerHTML = `
    <article class="third-sample-authorization-package-card blocked">
      <div class="protocol-card-head">
        <strong>${escapeHtml(packageState.target_sample_id || "no target sample")}</strong>
        <span>${escapeHtml(packageState.next_allowed_local_action)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(packageState.target_candidate_id || "none")}</dd></div>
        <div><dt>Approval</dt><dd>${escapeHtml(packageState.human_approval_status || "missing")}</dd></div>
        <div><dt>Approved by</dt><dd>${escapeHtml(packageState.approved_by || "none")}</dd></div>
        <div><dt>Registration ready</dt><dd>${escapeHtml(packageState.registration_ready)}</dd></div>
        <div><dt>Allowed files</dt><dd>${inlineList(packageState.exact_allowed_files)}</dd></div>
        <div><dt>Forbidden operations</dt><dd>${escapeHtml(packageState.forbidden_operation_count)}</dd></div>
        <div><dt>Missing requirements</dt><dd>${escapeHtml(packageState.missing_requirements.join("; ") || "none")}</dd></div>
        <div><dt>Statement present</dt><dd>${escapeHtml(packageState.exact_approval_statement_present)}</dd></div>
      </dl>
      <pre class="authorization-statement">${escapeHtml(packageState.exact_approval_statement_draft)}</pre>
    </article>
  `;
  qs("#thirdSampleAuthorizationPackageGuard").innerHTML = `
    <span>static panel only: ${escapeHtml(packageState.static_panel_only)}</span>
    <span>accepted_samples write: ${escapeHtml(packageState.accepted_samples_write_performed)}</span>
    <span>category write: ${escapeHtml(packageState.category_index_write_performed)}</span>
    <span>image copy: ${escapeHtml(packageState.image_file_copy_performed)}</span>
    <span>production candidate: ${escapeHtml(packageState.production_candidate_write_performed)}</span>
    <span>DailyNote: ${escapeHtml(packageState.DailyNote_write_performed)}</span>
    <span>VCP memory: ${escapeHtml(packageState.VCP_memory_write_performed)}</span>
    <span>provider/API/plugin/MCP: ${escapeHtml(packageState.provider_contact_performed || packageState.api_call_performed || packageState.plugin_call_performed || packageState.mcp_runtime_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(packageState.vcp_runtime_integration_proven)}</span>
  `;
}

function reviewConsoleRuntimeGapDashboardState() {
  const seed = state.runtime_gap_dashboard || {};
  const rows = Array.isArray(seed.rows) ? seed.rows : [];
  return {
    draft_output_key: "review_console_runtime_gap_dashboard_state",
    source_contract_ref: seed.source_contract_ref || null,
    dashboard_contract_status: seed.dashboard_contract_status || "missing",
    dashboard_progress_basis: seed.dashboard_progress_basis || "missing",
    runtime_gap_row_count: rows.length,
    local_capability_row_count: rows.filter((row) => row.row_kind === "local_capability").length,
    a5_boundary_row_count: rows.filter((row) => row.row_kind === "a5_boundary").length,
    runtime_claim_allowed: seed.runtime_claim_allowed === true,
    rows: rows.map((row) => ({
      row_id: row.row_id,
      row_kind: row.row_kind,
      current_status: row.current_status,
      source_evidence_ref: row.source_evidence_ref,
      requires_a5_authorization_before_execution: row.requires_a5_authorization_before_execution === true,
      runtime_integration_claim_allowed: false
    })),
    guard: {
      runtime_gap_dashboard_static_ui_only: true,
      fetch_performed: false,
      file_write_performed: false,
      authorization_execution_performed: false,
      package_execution_performed: false,
      accepted_samples_write_performed: false,
      manifest_read_performed: false,
      durable_archive_copy_performed: false,
      production_candidate_write_performed: false,
      failure_samples_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      mcp_runtime_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
      artifact_recoverability_is_not_vcp_runtime_integration: true,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderReviewConsoleRuntimeGapDashboard() {
  const dashboard = reviewConsoleRuntimeGapDashboardState();
  qs("#runtimeGapSummary").innerHTML = `
    <span>status <strong>${escapeHtml(dashboard.dashboard_contract_status)}</strong></span>
    <span>basis <strong>${escapeHtml(dashboard.dashboard_progress_basis)}</strong></span>
    <span>local <strong>${escapeHtml(dashboard.local_capability_row_count)}</strong></span>
    <span>A5 boundary <strong>${escapeHtml(dashboard.a5_boundary_row_count)}</strong></span>
    <span>runtime claim <strong>${escapeHtml(dashboard.runtime_claim_allowed)}</strong></span>
  `;
  qs("#runtimeGapBody").innerHTML = dashboard.rows.map((row) => `
    <article class="runtime-gap-card ${row.row_kind === "a5_boundary" ? "blocked" : "local"}">
      <strong>${escapeHtml(row.row_id)}</strong>
      <dl>
        <div><dt>Kind</dt><dd>${escapeHtml(row.row_kind)}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(row.current_status)}</dd></div>
        <div><dt>A5 required</dt><dd>${escapeHtml(row.requires_a5_authorization_before_execution)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(row.source_evidence_ref)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#runtimeGapGuard").innerHTML = `
    <span>static UI only: ${escapeHtml(dashboard.guard.runtime_gap_dashboard_static_ui_only)}</span>
    <span>fetch: ${escapeHtml(dashboard.guard.fetch_performed)}</span>
    <span>file write: ${escapeHtml(dashboard.guard.file_write_performed)}</span>
    <span>package execution: ${escapeHtml(dashboard.guard.package_execution_performed)}</span>
    <span>real manifest: ${escapeHtml(dashboard.guard.real_manifest_read_performed)}</span>
    <span>VCP read: ${escapeHtml(dashboard.guard.real_vcpchat_read_performed || dashboard.guard.real_vcptoolbox_read_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(dashboard.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function readonlyReviewCorpusRendererState() {
  return state.readonly_review_corpus_renderer;
}

function renderReadonlyReviewCorpusRenderer() {
  const renderer = readonlyReviewCorpusRendererState();
  qs("#readonlyReviewCorpusRendererSummary").innerHTML = `
    <span>status <strong>${escapeHtml(renderer.status)}</strong></span>
    <span>source <strong>${escapeHtml(renderer.source_renderer_ref)}</strong></span>
    <span>members <strong>${escapeHtml(renderer.member_count)}</strong></span>
    <span>rows <strong>${escapeHtml(renderer.total_case_rows)}</strong></span>
    <span>display only <strong>${escapeHtml(renderer.display_only)}</strong></span>
  `;
  qs("#readonlyReviewCorpusRendererRows").innerHTML = renderer.display_rows.map((row) => `
    <article class="readonly-review-corpus-card ${safeClassToken(row.outcome)}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.outcome)}</strong>
        <span>${escapeHtml(row.review_result_id)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(row.candidate_id)}</dd></div>
        <div><dt>Case</dt><dd>${escapeHtml(row.case_id)}</dd></div>
        <div><dt>Summary</dt><dd>${escapeHtml(row.summary)}</dd></div>
        <div><dt>Reasons</dt><dd>${inlineList(row.reasons)}</dd></div>
        <div><dt>Taxonomy</dt><dd>${inlineList(row.taxonomy_tags)}</dd></div>
        <div><dt>Blocking watch</dt><dd>${inlineList(row.blocking_watch_items)}</dd></div>
        <div><dt>Next action</dt><dd>${escapeHtml(row.next_review_action)}</dd></div>
        <div><dt>Metadata action</dt><dd>${escapeHtml(row.metadata_accumulation_action)}</dd></div>
        <div><dt>Metadata sections</dt><dd>${inlineList(row.metadata_queue_sections)}</dd></div>
      </dl>
    </article>
  `).join("");
  const sectionCards = [
    ...renderer.outcome_sections.map((section) => ({ ...section, kind: "outcome" })),
    ...renderer.next_action_sections.map((section) => ({ ...section, kind: "next_action" })),
    ...renderer.metadata_section_panels.map((section) => ({ ...section, kind: "metadata" }))
  ];
  qs("#readonlyReviewCorpusRendererSections").innerHTML = sectionCards.map((section) => `
    <article class="readonly-review-corpus-section">
      <strong>${escapeHtml(section.kind)}: ${escapeHtml(section.outcome || section.section_id)}</strong>
      <p>count: ${escapeHtml(section.count)}</p>
      <p>${inlineList(section.review_result_ids)}</p>
    </article>
  `).join("");
  qs("#readonlyReviewCorpusRendererGuard").innerHTML = `
    <span>metadata only: ${escapeHtml(renderer.guard.metadata_only)}</span>
    <span>read only: ${escapeHtml(renderer.guard.read_only)}</span>
    <span>file write: ${escapeHtml(renderer.guard.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(renderer.guard.provider_contact_performed || renderer.guard.plugin_call_performed || renderer.guard.api_call_performed)}</span>
    <span>image generation: ${escapeHtml(renderer.guard.image_generation_performed)}</span>
    <span>memory write: ${escapeHtml(renderer.guard.memory_write_performed || renderer.guard.DailyNote_write_performed || renderer.guard.VCP_memory_write_performed)}</span>
    <span>production 002: ${escapeHtml(renderer.guard.production_candidate_002_started)}</span>
  `;
}

function readonlyVisualReviewMvpState() {
  const renderer = readonlyReviewCorpusRendererState();
  const seed = state.readonly_visual_review_mvp_seed;
  const reviewRows = renderer.display_rows.map((row) => ({
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    summary: row.summary,
    reasons: row.reasons,
    taxonomy_tags: row.taxonomy_tags,
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
    metadata_queue_sections: row.metadata_queue_sections,
    write_allowed: row.write_allowed
  }));
  const taxonomyTags = [...new Set(reviewRows.flatMap((row) => row.taxonomy_tags || []))];
  const metadataSections = [...new Set(reviewRows.flatMap((row) => row.metadata_queue_sections || []))];
  const nextActions = [...new Set(reviewRows.map((row) => row.next_review_action))];
  return {
    state_id: seed.state_id,
    state_type: seed.state_type,
    status: seed.status,
    display_only: seed.display_only,
    source_artifact_catalog_ref: seed.source_artifact_catalog_ref,
    source_renderer_ref: renderer.source_renderer_ref,
    source_console_handoff_ref: seed.source_console_handoff_ref,
    catalog_summary: seed.catalog_summary,
    review_rows: reviewRows,
    outcome_summary: renderer.outcome_sections,
    taxonomy_summary: {
      visible_tags: taxonomyTags,
      patch_reject_tags_present: taxonomyTags.includes("material_failed") &&
        taxonomyTags.includes("lighting_failed") &&
        taxonomyTags.includes("subject_drift") &&
        taxonomyTags.includes("commercial_unusable")
    },
    metadata_queue_sections: metadataSections,
    next_actions: nextActions,
    guard_summary: {
      ...seed.guard_summary,
      file_write_performed: renderer.guard.file_write_performed,
      approval_write_performed: renderer.guard.approval_write_performed,
      accepted_samples_write_performed: renderer.guard.accepted_samples_write_performed,
      production_candidate_created: renderer.guard.production_candidate_created,
      provider_contact_performed: renderer.guard.provider_contact_performed,
      plugin_call_performed: renderer.guard.plugin_call_performed,
      api_call_performed: renderer.guard.api_call_performed,
      image_generation_performed: renderer.guard.image_generation_performed,
      DailyNote_write_performed: renderer.guard.DailyNote_write_performed,
      VCP_memory_write_performed: renderer.guard.VCP_memory_write_performed,
      memory_write_performed: renderer.guard.memory_write_performed,
      Batch_005_started: renderer.guard.Batch_005_started,
      production_candidate_002_started: renderer.guard.production_candidate_002_started
    }
  };
}

function renderReadonlyVisualReviewMvp() {
  const mvp = readonlyVisualReviewMvpState();
  qs("#readonlyVisualReviewMvpSummary").innerHTML = `
    <span>status <strong>${escapeHtml(mvp.status)}</strong></span>
    <span>artifacts <strong>${escapeHtml(mvp.catalog_summary.artifact_count)}</strong></span>
    <span>roles <strong>${escapeHtml(mvp.catalog_summary.canonical_role_count)}</strong></span>
    <span>rows <strong>${escapeHtml(mvp.review_rows.length)}</strong></span>
    <span>display only <strong>${escapeHtml(mvp.display_only)}</strong></span>
  `;
  qs("#readonlyVisualReviewMvpCatalog").innerHTML = `
    <article class="readonly-visual-review-catalog-card">
      <strong>${escapeHtml(mvp.source_artifact_catalog_ref)}</strong>
      <p>renderer: ${escapeHtml(mvp.source_renderer_ref)}</p>
      <p>handoff: ${escapeHtml(mvp.source_console_handoff_ref)}</p>
      <p>canonical roles: ${inlineList(mvp.catalog_summary.canonical_roles)}</p>
    </article>
  `;
  qs("#readonlyVisualReviewMvpRows").innerHTML = mvp.review_rows.map((row) => `
    <article class="readonly-review-corpus-card ${safeClassToken(row.outcome)}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.outcome)}</strong>
        <span>${escapeHtml(row.next_review_action)}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(row.candidate_id)}</dd></div>
        <div><dt>Summary</dt><dd>${escapeHtml(row.summary)}</dd></div>
        <div><dt>Reasons</dt><dd>${inlineList(row.reasons)}</dd></div>
        <div><dt>Taxonomy</dt><dd>${inlineList(row.taxonomy_tags)}</dd></div>
        <div><dt>Metadata sections</dt><dd>${inlineList(row.metadata_queue_sections)}</dd></div>
        <div><dt>Write allowed</dt><dd>${escapeHtml(row.write_allowed)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#readonlyVisualReviewMvpTaxonomy").innerHTML = [
    { kind: "taxonomy", label: "visible tags", values: mvp.taxonomy_summary.visible_tags },
    { kind: "metadata", label: "metadata sections", values: mvp.metadata_queue_sections },
    { kind: "next action", label: "next actions", values: mvp.next_actions }
  ].map((section) => `
    <article class="readonly-review-corpus-section">
      <strong>${escapeHtml(section.kind)}: ${escapeHtml(section.label)}</strong>
      <p>${inlineList(section.values)}</p>
    </article>
  `).join("");
  qs("#readonlyVisualReviewMvpGuard").innerHTML = `
    <span>static UI only: ${escapeHtml(mvp.guard_summary.static_ui_only)}</span>
    <span>fetch: ${escapeHtml(mvp.guard_summary.fetch_performed)}</span>
    <span>file write: ${escapeHtml(mvp.guard_summary.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(mvp.guard_summary.provider_contact_performed || mvp.guard_summary.plugin_call_performed || mvp.guard_summary.api_call_performed)}</span>
    <span>image generation: ${escapeHtml(mvp.guard_summary.image_generation_performed)}</span>
    <span>memory write: ${escapeHtml(mvp.guard_summary.memory_write_performed || mvp.guard_summary.DailyNote_write_performed || mvp.guard_summary.VCP_memory_write_performed)}</span>
    <span>production: ${escapeHtml(mvp.guard_summary.production_candidate_created || mvp.guard_summary.production_candidate_002_started)}</span>
  `;
}

function datasetRegressionRows(seed) {
  return seed.dimensions.flatMap((dimension) => ([
    {
      review_result_id: `readonly_visual_review_dataset_${safeClassToken(dimension.dimension_id)}_pass_001`,
      candidate_id: `dataset_${safeClassToken(dimension.dimension_id)}_pass_001`,
      case_id: `readonly_visual_review_dataset_case_${safeClassToken(dimension.dimension_id)}_pass_001`,
      dimension_id: dimension.dimension_id,
      dimension_label: dimension.label,
      outcome: "pass",
      outcome_alias: null,
      summary: `${dimension.label} passes metadata-only review with no blocking failure.`,
      reasons: [`${dimension.dimension_id}_clear_for_review`, "metadata_only_positive_reference"],
      taxonomy_tags: [],
      blocking_watch_items: [],
      next_review_action: "queue_for_future_human_review",
      metadata_accumulation_action: "keep_as_metadata_candidate",
      metadata_queue_sections: ["accepted_metadata_candidates", "archive_references", "next_review_actions"],
      write_allowed: false
    },
    {
      review_result_id: `readonly_visual_review_dataset_${safeClassToken(dimension.dimension_id)}_patch_001`,
      candidate_id: `dataset_${safeClassToken(dimension.dimension_id)}_patch_001`,
      case_id: `readonly_visual_review_dataset_case_${safeClassToken(dimension.dimension_id)}_patch_001`,
      dimension_id: dimension.dimension_id,
      dimension_label: dimension.label,
      outcome: "patch",
      outcome_alias: "needs_revision",
      summary: `${dimension.label} needs bounded revision before it can pass review.`,
      reasons: [`${dimension.dimension_id}_needs_revision`, "bounded_patch_plan_required"],
      taxonomy_tags: [dimension.patch_tag],
      blocking_watch_items: [`${dimension.dimension_id}_patch_watch`],
      next_review_action: "write_patch_plan_only",
      metadata_accumulation_action: "metadata_only_reference",
      metadata_queue_sections: ["patch_plan_only", "archive_references", "next_review_actions"],
      write_allowed: false
    },
    {
      review_result_id: `readonly_visual_review_dataset_${safeClassToken(dimension.dimension_id)}_reject_001`,
      candidate_id: `dataset_${safeClassToken(dimension.dimension_id)}_reject_001`,
      case_id: `readonly_visual_review_dataset_case_${safeClassToken(dimension.dimension_id)}_reject_001`,
      dimension_id: dimension.dimension_id,
      dimension_label: dimension.label,
      outcome: "reject",
      outcome_alias: null,
      summary: `${dimension.label} has a blocking failure and stays failure-learning only.`,
      reasons: [`${dimension.dimension_id}_blocking_failure`, "never_production_route_required"],
      taxonomy_tags: [dimension.reject_tag],
      blocking_watch_items: [`${dimension.dimension_id}_blocking_watch`],
      next_review_action: "defer_until_taxonomy_update",
      metadata_accumulation_action: "keep_as_failure_learning_metadata",
      metadata_queue_sections: ["failure_learning_metadata", "archive_references", "next_review_actions"],
      write_allowed: false
    }
  ]));
}

function readonlyVisualReviewDatasetRegressionState() {
  const seed = state.readonly_visual_review_dataset_regression_seed;
  const reviewRows = datasetRegressionRows(seed);
  const outcomeTotals = ["pass", "patch", "reject"].map((outcome) => ({
    outcome,
    count: reviewRows.filter((row) => row.outcome === outcome).length,
    review_result_ids: reviewRows.filter((row) => row.outcome === outcome).map((row) => row.review_result_id)
  }));
  return {
    state_id: seed.state_id,
    state_type: seed.state_type,
    status: seed.status,
    display_only: seed.display_only,
    source_taxonomy_ref: seed.source_taxonomy_ref,
    source_mvp_state_ref: seed.source_mvp_state_ref,
    outcome_aliases: seed.outcome_aliases,
    dimension_count: seed.dimensions.length,
    review_row_count: reviewRows.length,
    dimensions: seed.dimensions.map((dimension) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      outcomes: ["pass", "patch", "reject"],
      patch_tag: dimension.patch_tag,
      reject_tag: dimension.reject_tag
    })),
    review_rows: reviewRows,
    outcome_totals: outcomeTotals,
    taxonomy_coverage: {
      patch_tags: seed.dimensions.map((dimension) => dimension.patch_tag),
      reject_tags: seed.dimensions.map((dimension) => dimension.reject_tag)
    },
    metadata_queue_sections: [...new Set(reviewRows.flatMap((row) => row.metadata_queue_sections))],
    next_actions: [...new Set(reviewRows.map((row) => row.next_review_action))],
    guard_summary: seed.guard_summary
  };
}

function renderReadonlyVisualReviewDatasetRegression() {
  const dataset = readonlyVisualReviewDatasetRegressionState();
  qs("#readonlyVisualReviewDatasetSummary").innerHTML = `
    <span>status <strong>${escapeHtml(dataset.status)}</strong></span>
    <span>dimensions <strong>${escapeHtml(dataset.dimension_count)}</strong></span>
    <span>rows <strong>${escapeHtml(dataset.review_row_count)}</strong></span>
    <span>pass <strong>${escapeHtml(dataset.outcome_totals.find((item) => item.outcome === "pass").count)}</strong></span>
    <span>patch <strong>${escapeHtml(dataset.outcome_totals.find((item) => item.outcome === "patch").count)}</strong></span>
    <span>reject <strong>${escapeHtml(dataset.outcome_totals.find((item) => item.outcome === "reject").count)}</strong></span>
  `;
  qs("#readonlyVisualReviewDatasetCoverage").innerHTML = [
    { kind: "dimension", label: "7-dimension coverage", values: dataset.dimensions.map((dimension) => dimension.dimension_id) },
    { kind: "taxonomy", label: "patch tags", values: dataset.taxonomy_coverage.patch_tags },
    { kind: "taxonomy", label: "reject tags", values: dataset.taxonomy_coverage.reject_tags },
    { kind: "alias", label: "needs_revision", values: [`needs_revision -> ${dataset.outcome_aliases.needs_revision}`] }
  ].map((section) => `
    <article class="readonly-review-corpus-section">
      <strong>${escapeHtml(section.kind)}: ${escapeHtml(section.label)}</strong>
      <p>${inlineList(section.values)}</p>
    </article>
  `).join("");
  qs("#readonlyVisualReviewDatasetRows").innerHTML = dataset.review_rows.map((row) => `
    <article class="readonly-visual-review-dataset-row ${safeClassToken(row.outcome)}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(row.dimension_id)}</strong>
        <span>${escapeHtml(row.outcome)}${row.outcome_alias ? ` / ${escapeHtml(row.outcome_alias)}` : ""}</span>
      </div>
      <dl>
        <div><dt>Candidate</dt><dd>${escapeHtml(row.candidate_id)}</dd></div>
        <div><dt>Summary</dt><dd>${escapeHtml(row.summary)}</dd></div>
        <div><dt>Taxonomy</dt><dd>${inlineList(row.taxonomy_tags)}</dd></div>
        <div><dt>Next action</dt><dd>${escapeHtml(row.next_review_action)}</dd></div>
        <div><dt>Write allowed</dt><dd>${escapeHtml(row.write_allowed)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#readonlyVisualReviewDatasetGuard").innerHTML = `
    <span>static UI only: ${escapeHtml(dataset.guard_summary.static_ui_only)}</span>
    <span>fetch: ${escapeHtml(dataset.guard_summary.fetch_performed)}</span>
    <span>file write: ${escapeHtml(dataset.guard_summary.file_write_performed)}</span>
    <span>provider/plugin/API: ${escapeHtml(dataset.guard_summary.provider_contact_performed || dataset.guard_summary.plugin_call_performed || dataset.guard_summary.api_call_performed)}</span>
    <span>image generation: ${escapeHtml(dataset.guard_summary.image_generation_performed)}</span>
    <span>memory write: ${escapeHtml(dataset.guard_summary.memory_write_performed || dataset.guard_summary.DailyNote_write_performed || dataset.guard_summary.VCP_memory_write_performed)}</span>
    <span>production: ${escapeHtml(dataset.guard_summary.production_candidate_created)}</span>
  `;
}

function loadImportRecordSeed() {
  qs("#importRecordInput").value = importRecordSeedText();
  parseImportRecordText("project_local_seed");
}

function handleImportRecordFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    qs("#importRecordInput").value = String(reader.result || "");
    parseImportRecordText("user_selected_file");
  });
  reader.addEventListener("error", () => {
    state.import_record_reader = {
      source_mode: "user_selected_file",
      parse_status: "parse_failed",
      errors: ["browser FileReader could not read the selected file"],
      parsed: null,
      guard: {
        parsed_in_memory: false,
        fetch_performed: false,
        file_write_performed: false,
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        mcp_runtime_performed: false,
        daily_note_write_performed: false,
        vcp_memory_write_performed: false
      }
    };
    renderImportRecordReader();
    renderDraft();
  });
  reader.readAsText(file);
}

function renderVersions() {
  const root = qs("#versionList");
  root.innerHTML = "";
  state.image_versions.forEach((version) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `version-item${version.version_id === state.currentVersionId ? " is-active" : ""}`;
    button.innerHTML = `
      <span>
        <strong>${escapeHtml(version.label)}</strong>
        <small>${escapeHtml(version.asset_ref)}</small>
      </span>
      <span>${escapeHtml(version.score)}</span>
    `;
    button.addEventListener("click", () => {
      state.currentVersionId = version.version_id;
      renderAll();
    });
    root.appendChild(button);
  });

  qs("#currentVersionScore").textContent = currentVersion().score;
}

function renderScores() {
  const root = qs("#scoreControls");
  root.innerHTML = "";
  scoreModel.forEach(([key, label, max, ai]) => {
    const row = document.createElement("label");
    row.className = "score-row";
    row.innerHTML = `
      <span>${escapeHtml(label)}</span>
      <input type="range" min="0" max="${escapeHtml(max)}" value="${escapeHtml(state.humanScores[key])}" data-score-key="${escapeHtml(key)}" />
      <output>${escapeHtml(state.humanScores[key])} / ${escapeHtml(max)}</output>
    `;
    row.querySelector("input").addEventListener("input", (event) => {
      state.humanScores[key] = Number(event.target.value);
      row.querySelector("output").textContent = `${state.humanScores[key]} / ${max}`;
      updateTotals();
      renderReviewerStickySummary();
      renderReviewSpineV11();
      renderDraft();
    });
    row.title = `AI 初评：${ai} / ${max}`;
    root.appendChild(row);
  });
  updateTotals();
}

function updateTotals() {
  const aiTotal = totalFrom(null, 3);
  const humanTotal = totalFrom(state.humanScores);
  qs("#aiTotal").textContent = aiTotal;
  qs("#humanTotal").textContent = humanTotal;
  qs("#finalTotal").textContent = humanTotal;
}

function renderComments() {
  const root = qs("#commentList");
  root.innerHTML = "";
  state.comments.forEach((comment) => {
    const item = document.createElement("article");
    item.className = `comment-item ${safeClassToken(comment.severity)}`;
    item.innerHTML = `
      <strong>${escapeHtml(comment.target)} / ${escapeHtml(comment.severity)}</strong>
      <p>${escapeHtml(comment.comment_cn)}</p>
      <small>${escapeHtml(comment.author)} · ${escapeHtml(comment.created_at)} · ${escapeHtml(comment.status)}</small>
    `;
    root.appendChild(item);
  });
}

function addComment() {
  const text = qs("#commentText").value.trim();
  if (!text) return;
  state.comments.unshift({
    comment_id: `comment-${String(state.comments.length + 1).padStart(3, "0")}`,
    author: "human_reviewer",
    author_type: "human",
    target: qs("#commentTarget").value,
    severity: qs("#commentSeverity").value,
    comment_cn: text,
    status: "open",
    created_at: nowIso()
  });
  qs("#commentText").value = "";
  renderComments();
  renderDraft();
}

function archiveActionFor(status) {
  if (status === "accepted") return "approve_archive";
  if (status === "candidate") return "mark_candidate";
  if (status === "rejected") return "reject_archive";
  return "request_iteration";
}

function archiveStatusLabel(status) {
  if (status === "accepted") return "批准入库";
  if (status === "candidate") return "候选";
  if (status === "rejected") return "拒绝入库";
  return "继续迭代";
}

function memoryStatusLabel(status) {
  if (status === "approved") return "批准记忆";
  if (status === "rejected") return "拒绝记忆";
  return "要求修改";
}

function sessionStatusLabel(status) {
  if (status === "human_reviewing") return "人工审片中";
  if (status === "in_review") return "审片中";
  if (status === "complete") return "已完成";
  if (status === "draft") return "草案";
  return status;
}

function archiveTone(status) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "danger";
  if (status === "draft") return "warning";
  return "";
}

function memoryTone(status) {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "";
}

function archiveDownstreamEffect(status) {
  if (status === "accepted") return "仅生成已批准归档草案；production candidate registry 仍未写入。";
  if (status === "rejected") return "进入拒绝/失败学习路径；production 与记忆写入继续阻断。";
  if (status === "draft") return "要求继续迭代；当前版本不进入归档或记忆写入。";
  return "保持候选状态；等待人工最终批准或继续迭代。";
}

function memoryDownstreamEffect(status) {
  if (status === "approved") return "仅解锁已审批写入申请草案；仍不直接调用 DailyNote 或 VCP 记忆。";
  if (status === "rejected") return "记忆写入被拒绝；DailyNote 与 VCP 记忆写入继续为 false。";
  return "记忆需要修改；DailyNote 与 VCP 记忆写入保持锁定。";
}

function nextReviewerActionLabel() {
  if (state.assetStatus === "rejected") return "确认拒绝证据";
  if (state.assetStatus === "draft") return "进入下一轮迭代";
  if (state.assetStatus === "accepted" && state.memoryStatus === "approved") return "准备最终封存";
  if (state.assetStatus === "accepted") return "补齐记忆审批";
  if (state.memoryStatus === "approved") return "确认资产批准";
  return "人工批准或继续迭代";
}

function evidenceModeLabel(mode) {
  return mode === "full" ? "完整证据" : "关键证据";
}

function evidenceFocusStatusLabel(status) {
  if (status === "sufficient") return "证据充足";
  if (status === "sufficient_with_active_blockers") return "证据充足但仍有阻断";
  return "证据不足";
}

function blockerSeverityLabel(severity) {
  if (severity === "hard_blocker") return "强阻断";
  if (severity === "critical") return "严重";
  if (severity === "high") return "高";
  if (severity === "medium") return "中";
  if (severity === "low") return "低";
  return "未知";
}

function blockerSourceLabel(source) {
  if (source === "human_approval_blocker_queue") return "人工批准";
  if (source === "evidence_blocker_contract") return "证据合约";
  if (source === "review_blocker_arbiter") return "阻断仲裁";
  if (source === "artifact_lifecycle_state_reader") return "资产生命周期";
  return source || "未知";
}

function reviewTokenLabel(value) {
  const token = String(value || "");
  const labels = {
    human_approval_missing: "缺少人工批准",
    human_review_required: "需要人工复核",
    production_promotion: "生产推广",
    production_exclusion: "生产排除",
    blocked: "已阻断",
    unknown_scope: "未知范围"
  };
  if (labels[token]) return labels[token];
  return token.replace(/_/g, " ");
}

function reviewBlockerMessageLabel(message) {
  return String(message || "未知阻断")
    .split("/")
    .map((part) => reviewTokenLabel(part.trim()))
    .join(" / ");
}

function reviewActionLabel(action) {
  const text = String(action || "");
  if (text.includes("wait_for_jenn_user_submission_then_run_v14_214_intake")) return "等待 Jenn 提交后运行 v14.214 intake";
  if (text.includes("wait_for_jenn_human_approval")) return "等待 Jenn 完成人工批准";
  if (text.includes("production_candidate=false")) return "保持非生产候选，等待人工审批或失败学习归档";
  if (text.includes("production promotion")) return text.replace("production promotion", "生产推广");
  if (text.includes("blocker action")) return "当前筛选没有命中阻断动作。";
  return text || "暂无动作";
}

function sortedUniqueValues(values, rank = {}) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) => {
    const leftRank = rank[left] ?? 99;
    const rightRank = rank[right] ?? 99;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.localeCompare(right);
  });
}

function blockerFilterButtonHtml(filterType, value, label, count, activeValue) {
  const dataAttribute = filterType === "severity" ? "data-blocker-severity-filter" : "data-blocker-source-filter";
  const active = value === activeValue;
  return `
    <button type="button" ${dataAttribute}="${escapeHtml(value)}" class="${active ? "is-active" : ""}" aria-pressed="${escapeHtml(active)}">
      ${escapeHtml(label)} <span>${escapeHtml(count)}</span>
    </button>
  `;
}

function evidenceAnchorId(kind, value) {
  return `evidence-anchor-${safeClassToken(kind)}-${safeClassToken(value || "unknown")}`;
}

function humanApprovalBlockerAnchorId(blocker) {
  return evidenceAnchorId("human-approval", blocker.blocker_id || blocker.target_sample_id || blocker.target_candidate_id);
}

function evidenceBlockerAnchorId(blocker) {
  return evidenceAnchorId("evidence-blocker", blocker.blocker_id || blocker.candidate_id);
}

function blockerArbiterAnchorId(item) {
  return evidenceAnchorId("arbiter", item.production_blocker_decision_id || item.candidate_id);
}

function artifactLifecycleAnchorId(artifactId) {
  return evidenceAnchorId("artifact-lifecycle", artifactId);
}

function evidenceFocusState() {
  const queue = humanApprovalBlockerQueueState();
  const evidenceHandoff = state.review_evidence_blocker_contract_static_handoff || {};
  const arbiterHandoff = state.review_blocker_arbiter_static_handoff || {};
  const blockerSummary = evidenceHandoff.blocker_summary || {};
  const arbiterSummary = arbiterHandoff.arbiter_summary || {};
  const arbitrationGuard = evidenceHandoff.arbitration_guard || {};
  const artifactSort = artifactEvidenceStatusSortState();
  const activeBlockers = [];

  queue.blockers.forEach((blocker) => {
    activeBlockers.push({
      source: "human_approval_blocker_queue",
      id: blocker.blocker_id,
      severity: blocker.severity,
      target: blocker.target_sample_id || blocker.target_candidate_id || "unknown",
      message: blocker.blocker_type,
      required_action: blocker.next_allowed_local_action,
      anchor_id: humanApprovalBlockerAnchorId(blocker),
      anchor_label_cn: "人工批准阻断队列"
    });
  });

  (evidenceHandoff.blocker_decisions || []).forEach((blocker) => {
    const isBlocking = blocker.permanent_block === true || blocker.production_candidate === false || String(blocker.decision || "").includes("block");
    if (!isBlocking) return;
    activeBlockers.push({
      source: "evidence_blocker_contract",
      id: blocker.blocker_id || blocker.candidate_id,
      severity: blocker.permanent_block ? "critical" : "high",
      target: blocker.candidate_id,
      message: `${blocker.blocker_type || "blocker"} / ${blocker.blocking_scope || "unknown_scope"}`,
      required_action: "保持 production_candidate=false，等待人工审批或失败学习归档",
      anchor_id: evidenceBlockerAnchorId(blocker),
      anchor_label_cn: "证据阻断决策"
    });
  });

  (arbiterHandoff.candidate_arbitrations || []).forEach((item) => {
    const isBlocking = item.never_production === true || item.memory_forbidden === true || String(item.production_decision || "").includes("blocked");
    if (!isBlocking) return;
    activeBlockers.push({
      source: "review_blocker_arbiter",
      id: item.production_blocker_decision_id || item.candidate_id,
      severity: item.never_production ? "critical" : "high",
      target: item.candidate_id,
      message: item.final_route || item.production_decision || "blocked",
      required_action: item.memory_forbidden ? "禁止记忆写入；保留为失败学习证据" : "禁止 production promotion",
      anchor_id: blockerArbiterAnchorId(item),
      anchor_label_cn: "阻断仲裁"
    });
  });

  if (artifactSort.blocked_candidate_artifact_id) {
    activeBlockers.push({
      source: "artifact_lifecycle_state_reader",
      id: artifactSort.blocked_candidate_artifact_id,
      severity: "high",
      target: artifactSort.blocked_candidate_artifact_id,
      message: "human_approval_missing",
      required_action: "补齐正式人工批准证据后重新校验",
      anchor_id: artifactLifecycleAnchorId(artifactSort.blocked_candidate_artifact_id),
      anchor_label_cn: "资产生命周期"
    });
  }

  const sufficiencyChecks = [
    {
      check_id: "every_candidate_has_evidence_record",
      label_cn: "每个候选都有 evidence record",
      passed: arbitrationGuard.every_candidate_has_evidence_record === true
    },
    {
      check_id: "every_candidate_has_production_blocker_decision",
      label_cn: "每个候选都有 production blocker decision",
      passed: arbitrationGuard.every_candidate_has_production_blocker_decision === true
    },
    {
      check_id: "evidence_record_is_not_approval",
      label_cn: "evidence record 不等于人工批准",
      passed: arbitrationGuard.evidence_record_is_not_approval === true
    },
    {
      check_id: "blocker_decision_is_not_write",
      label_cn: "blocker decision 不等于写入动作",
      passed: arbitrationGuard.blocker_decision_is_not_write === true
    }
  ];
  const sufficiencyPassed = sufficiencyChecks.every((check) => check.passed);
  const sufficiencyStatus = sufficiencyPassed
    ? activeBlockers.length > 0 ? "sufficient_with_active_blockers" : "sufficient"
    : "insufficient";
  const severityRank = { hard_blocker: 0, critical: 1, high: 2, medium: 3, low: 4, unknown: 5 };
  const sourceRank = {
    human_approval_blocker_queue: 0,
    evidence_blocker_contract: 1,
    review_blocker_arbiter: 2,
    artifact_lifecycle_state_reader: 3
  };
  const severityValues = sortedUniqueValues(activeBlockers.map((blocker) => blocker.severity || "unknown"), severityRank);
  const sourceValues = sortedUniqueValues(activeBlockers.map((blocker) => blocker.source || "unknown"), sourceRank);
  const severityFilter = severityValues.includes(state.blockerSeverityFilter) ? state.blockerSeverityFilter : "all";
  const sourceFilter = sourceValues.includes(state.blockerSourceFilter) ? state.blockerSourceFilter : "all";
  const filteredActiveBlockers = activeBlockers.filter((blocker) => (
    (severityFilter === "all" || blocker.severity === severityFilter)
    && (sourceFilter === "all" || blocker.source === sourceFilter)
  ));
  const primaryFilteredBlocker = filteredActiveBlockers[0] || null;
  const filterOptions = {
    severity: [
      { value: "all", label: "All", count: activeBlockers.length },
      ...severityValues.map((value) => ({
        value,
        label: blockerSeverityLabel(value),
        count: activeBlockers.filter((blocker) => blocker.severity === value).length
      }))
    ],
    source: [
      { value: "all", label: "All", count: activeBlockers.length },
      ...sourceValues.map((value) => ({
        value,
        label: blockerSourceLabel(value),
        count: activeBlockers.filter((blocker) => blocker.source === value).length
      }))
    ]
  };

  return {
    draft_output_key: "evidence_progressive_disclosure_state",
    mode: state.evidenceMode,
    mode_cn: evidenceModeLabel(state.evidenceMode),
    raw_evidence_visible: state.evidenceMode === "full",
    default_triage_only: state.evidenceMode === "triage",
    active_blockers: activeBlockers,
    active_blocker_count: activeBlockers.length,
    active_blocker_filter: {
      severity: severityFilter,
      source: sourceFilter,
      severity_cn: severityFilter === "all" ? "全部严重度" : blockerSeverityLabel(severityFilter),
      source_cn: sourceFilter === "all" ? "全部来源" : blockerSourceLabel(sourceFilter),
      filtered_count: filteredActiveBlockers.length,
      total_count: activeBlockers.length,
      options: filterOptions
    },
    filtered_active_blockers: filteredActiveBlockers,
    filtered_active_blocker_count: filteredActiveBlockers.length,
    filtered_required_action_summary: {
      matched_count: filteredActiveBlockers.length,
      total_count: activeBlockers.length,
      filter_applied: severityFilter !== "all" || sourceFilter !== "all",
      summary_cn: primaryFilteredBlocker
        ? `当前筛选命中 ${filteredActiveBlockers.length}/${activeBlockers.length} 条；优先处理 ${primaryFilteredBlocker.target}。`
        : `当前筛选命中 0/${activeBlockers.length} 条；恢复 All 或调整筛选。`,
      primary_target: primaryFilteredBlocker?.target || null,
      primary_source: primaryFilteredBlocker?.source || null,
      primary_source_cn: primaryFilteredBlocker ? blockerSourceLabel(primaryFilteredBlocker.source) : null,
      primary_severity: primaryFilteredBlocker?.severity || null,
      primary_severity_cn: primaryFilteredBlocker ? blockerSeverityLabel(primaryFilteredBlocker.severity) : null,
      primary_message: primaryFilteredBlocker?.message || null,
      primary_required_action: primaryFilteredBlocker?.required_action || null,
      primary_anchor_id: primaryFilteredBlocker?.anchor_id || null,
      primary_anchor_label_cn: primaryFilteredBlocker?.anchor_label_cn || null,
      production_write_now: false,
      DailyNote_write_now: false,
      VCP_memory_write_now: false
    },
    required_action: {
      primary_action_cn: nextReviewerActionLabel(),
      first_blocker_action: activeBlockers[0]?.required_action || null,
      first_filtered_blocker_action: primaryFilteredBlocker?.required_action || null,
      production_write_now: false,
      DailyNote_write_now: false,
      VCP_memory_write_now: false
    },
    evidence_sufficiency: {
      status: sufficiencyStatus,
      status_cn: evidenceFocusStatusLabel(sufficiencyStatus),
      checks: sufficiencyChecks,
      evidence_record_count: Number(blockerSummary.evidence_record_count || 0),
      blocker_decision_count: Number(blockerSummary.blocker_decision_count || 0),
      permanent_block_count: Number(blockerSummary.permanent_block_count || 0),
      production_blocked_count: Number(arbiterSummary.production_blocked_count || 0),
      artifact_blocked_count: artifactSort.blocked_count
    },
    full_protocol_panel_available: true,
    full_output_panel_available: true,
    full_evidence_anchor_state: state.lastEvidenceAnchor,
    static_ui_only: true,
    fetch_performed: false,
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false
  };
}

function updatePressedState(selector, dataKey, activeValue) {
  qsa(selector).forEach((button) => {
    const isActive = button.dataset[dataKey] === activeValue;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function decisionTargetDisplayLabel(target) {
  const samplePrefix = target?.sample_number ? `样片 ${target.sample_number}` : "样片";
  return `${samplePrefix}: ${target?.sample_id || state.currentVersionId}`;
}

function decisionTargetSourceLabel(target) {
  if (target?.decision_target_source === "selected_asset_archive_preview") return "asset_archive 预览";
  if (target?.decision_target_source === "review_session_image_version") return "审片会话版本";
  return "静态样片";
}

function decisionEventWithTarget(event = state.lastDecisionEvent, target = currentReviewTarget()) {
  return {
    ...(event || {}),
    target_sample_id: target.sample_id,
    target_preview_id: target.preview_id,
    target_sample_number: target.sample_number,
    target_source_cn: decisionTargetSourceLabel(target)
  };
}

function recordDecisionEvent(scope, message, downstreamEffect) {
  const target = currentReviewTarget();
  state.lastDecisionEvent = {
    scope,
    message_cn: message,
    changed_at: nowIso(),
    changed_by: "human_reviewer",
    target_sample_id: target.sample_id,
    target_preview_id: target.preview_id,
    target_sample_number: target.sample_number,
    target_source_cn: decisionTargetSourceLabel(target),
    downstream_effect_cn: downstreamEffect
  };
}

function renderDecisionStatus() {
  const decisionTarget = currentReviewTarget();
  const summary = qs("#currentDecisionSummary");
  const feedback = qs("#decisionFeedback");
  if (!summary || !feedback) return;

  updatePressedState("[data-archive]", "archive", state.assetStatus);
  updatePressedState("[data-memory]", "memory", state.memoryStatus);

  summary.innerHTML = `
    <span><strong>审片目标</strong>${escapeHtml(decisionTargetDisplayLabel(decisionTarget))}</span>
    <span><strong>目标来源</strong>${escapeHtml(decisionTargetSourceLabel(decisionTarget))}</span>
    <span><strong>资产决定</strong>${escapeHtml(archiveStatusLabel(state.assetStatus))}</span>
    <span><strong>记忆决定</strong>${escapeHtml(memoryStatusLabel(state.memoryStatus))}</span>
    <span><strong>安全边界</strong>生产 / DailyNote / VCP 均不写</span>
  `;

  const event = decisionEventWithTarget(state.lastDecisionEvent, decisionTarget);
  const tone = event.scope === "memory" ? memoryTone(state.memoryStatus) : archiveTone(state.assetStatus);
  feedback.className = `decision-feedback${tone ? ` ${tone}` : ""}`;
  feedback.innerHTML = `
    <strong>${escapeHtml(event.message_cn)}</strong><br />
    ${escapeHtml(event.downstream_effect_cn)}
    <small> ${escapeHtml(event.changed_by)} · ${escapeHtml(event.changed_at)} · ${escapeHtml(event.target_sample_id || decisionTarget.sample_id)}</small>
  `;
  renderReviewerStickySummary();
}

function renderReviewerStickySummary() {
  const root = qs("#reviewerStickySummary");
  if (!root) return;
  const decisionTarget = currentReviewTarget();
  const humanTotal = totalFrom(state.humanScores);
  const assetTone = archiveTone(state.assetStatus);
  const memoryToneClass = memoryTone(state.memoryStatus);
  root.innerHTML = `
    <span><strong>审片目标</strong>${escapeHtml(decisionTargetDisplayLabel(decisionTarget))}</span>
    <span><strong>来源</strong>${escapeHtml(decisionTargetSourceLabel(decisionTarget))}</span>
    <span><strong>总分</strong>${escapeHtml(humanTotal)}</span>
    <span class="${escapeHtml(assetTone)}"><strong>资产决定</strong>${escapeHtml(archiveStatusLabel(state.assetStatus))}</span>
    <span class="${escapeHtml(memoryToneClass || "warning")}"><strong>记忆决定</strong>${escapeHtml(memoryStatusLabel(state.memoryStatus))}</span>
    <span><strong>写入边界</strong>生产 / DailyNote / VCP 均不写</span>
    <span><strong>下一步</strong>${escapeHtml(nextReviewerActionLabel())}</span>
  `;
}

function applyEvidenceMode() {
  let shell = null;
  try {
    shell = qs(".review-shell");
  } catch (error) {
    shell = null;
  }
  if (shell) {
    shell.classList.toggle("evidence-mode-triage", state.evidenceMode === "triage");
    shell.classList.toggle("evidence-mode-full", state.evidenceMode === "full");
  }
  try {
    updatePressedState("[data-evidence-mode]", "evidenceMode", state.evidenceMode);
  } catch (error) {
    // Some static draft validators emulate only the draft output fields, not every UI control.
  }
}

function renderEvidenceFocus() {
  const summaryRoot = qs("#evidenceFocusSummary");
  const bodyRoot = qs("#evidenceFocusBody");
  if (!summaryRoot || !bodyRoot) return;
  applyEvidenceMode();
  const focus = evidenceFocusState();
  const blockerTone = focus.active_blocker_count > 0 ? "blocked" : "sufficient";
  const sufficiencyTone = focus.evidence_sufficiency.status === "insufficient"
    ? "insufficient"
    : focus.evidence_sufficiency.status === "sufficient_with_active_blockers" ? "warning" : "sufficient";
  const visibleBlockers = focus.filtered_active_blockers.slice(0, 6);
  const blockerFilter = focus.active_blocker_filter;
  const filteredAction = focus.filtered_required_action_summary;

  summaryRoot.innerHTML = `
    <span>mode <strong>${escapeHtml(focus.mode_cn)}</strong></span>
    <span>active blockers <strong>${escapeHtml(`${focus.filtered_active_blocker_count}/${focus.active_blocker_count}`)}</strong></span>
    <span>severity <strong>${escapeHtml(blockerFilter.severity_cn)}</strong></span>
    <span>source <strong>${escapeHtml(blockerFilter.source_cn)}</strong></span>
    <span>required action <strong>${escapeHtml(focus.required_action.primary_action_cn)}</strong></span>
    <span>sufficiency <strong>${escapeHtml(focus.evidence_sufficiency.status_cn)}</strong></span>
    <span>raw evidence <strong>${escapeHtml(focus.raw_evidence_visible ? "visible" : "collapsed")}</strong></span>
  `;

  bodyRoot.innerHTML = `
    <article class="evidence-focus-card ${blockerTone}">
      <div class="evidence-focus-card-head">
        <strong>Active blockers</strong>
        <span>${escapeHtml(focus.filtered_active_blocker_count)} / ${escapeHtml(focus.active_blocker_count)}</span>
      </div>
      <div class="evidence-focus-filter-bar" aria-label="活动阻断快速筛选">
        <div class="evidence-filter-group">
          <span>风险级别</span>
          <div class="evidence-filter-buttons">
            ${blockerFilter.options.severity.map((option) => blockerFilterButtonHtml("severity", option.value, option.label, option.count, blockerFilter.severity)).join("")}
          </div>
        </div>
        <div class="evidence-filter-group">
          <span>来源</span>
          <div class="evidence-filter-buttons">
            ${blockerFilter.options.source.map((option) => blockerFilterButtonHtml("source", option.value, option.label, option.count, blockerFilter.source)).join("")}
          </div>
        </div>
      </div>
      <div class="evidence-filter-action-summary" aria-label="当前筛选命中的 required action">
        <div>
          <strong>筛选后的待处理动作</strong>
          <span>${escapeHtml(filteredAction.summary_cn)}</span>
        </div>
        <p>${escapeHtml(reviewActionLabel(filteredAction.primary_required_action || "当前筛选没有命中 blocker action。"))}</p>
        ${filteredAction.primary_anchor_id ? `
          <button type="button" class="evidence-anchor-button" data-full-evidence-anchor="${escapeHtml(filteredAction.primary_anchor_id)}">
            定位到完整证据
          </button>
        ` : ""}
        <dl>
          <div><dt>对象</dt><dd>${escapeHtml(filteredAction.primary_target || "无")}</dd></div>
          <div><dt>风险</dt><dd>${escapeHtml(filteredAction.primary_severity_cn || "无")}</dd></div>
          <div><dt>来源</dt><dd>${escapeHtml(filteredAction.primary_source_cn || "无")}</dd></div>
        </dl>
      </div>
      ${visibleBlockers.length > 0 ? `
        <ul class="evidence-focus-list">
          ${visibleBlockers.map((blocker) => `
            <li class="${escapeHtml(safeClassToken(blocker.severity))}">
              <strong>${escapeHtml(blocker.target)} · ${escapeHtml(reviewBlockerMessageLabel(blocker.message))}</strong>
              <span>${escapeHtml(blockerSeverityLabel(blocker.severity))} / ${escapeHtml(blockerSourceLabel(blocker.source))} / ${escapeHtml(reviewActionLabel(blocker.required_action))}</span>
              <button type="button" class="evidence-anchor-button" data-full-evidence-anchor="${escapeHtml(blocker.anchor_id)}">
                定位到完整证据
              </button>
            </li>
          `).join("")}
        </ul>
        ${focus.filtered_active_blocker_count > visibleBlockers.length ? `<p class="evidence-focus-overflow">当前筛选另有 ${escapeHtml(focus.filtered_active_blocker_count - visibleBlockers.length)} 条阻断保留在完整证据中。</p>` : ""}
      ` : `<p class="evidence-focus-note">当前筛选没有命中；调整 severity/source 可恢复阻断列表。</p>`}
    </article>
    <article class="evidence-focus-card action">
      <div class="evidence-focus-card-head">
        <strong>Required action</strong>
        <span>reviewer next</span>
      </div>
      <p>${escapeHtml(focus.required_action.primary_action_cn)}</p>
      <p class="evidence-focus-note">${escapeHtml(focus.required_action.first_blocker_action || "无额外 blocker action。")}</p>
      <ul class="evidence-focus-checklist">
        <li class="blocked"><strong>production write</strong><span>${escapeHtml(focus.required_action.production_write_now)}</span></li>
        <li class="blocked"><strong>DailyNote write</strong><span>${escapeHtml(focus.required_action.DailyNote_write_now)}</span></li>
        <li class="blocked"><strong>VCP memory write</strong><span>${escapeHtml(focus.required_action.VCP_memory_write_now)}</span></li>
      </ul>
    </article>
    <article class="evidence-focus-card ${sufficiencyTone}">
      <div class="evidence-focus-card-head">
        <strong>Evidence sufficiency</strong>
        <span>${escapeHtml(focus.evidence_sufficiency.status_cn)}</span>
      </div>
      <ul class="evidence-focus-checklist">
        ${focus.evidence_sufficiency.checks.map((check) => `
          <li class="${check.passed ? "pass" : "blocked"}">
            <strong>${escapeHtml(check.label_cn)}</strong>
            <span>${escapeHtml(check.passed ? "pass" : "blocked")}</span>
          </li>
        `).join("")}
      </ul>
      <p class="evidence-focus-note">
        evidence ${escapeHtml(focus.evidence_sufficiency.evidence_record_count)} /
        blocker ${escapeHtml(focus.evidence_sufficiency.blocker_decision_count)} /
        artifact blocked ${escapeHtml(focus.evidence_sufficiency.artifact_blocked_count)}
      </p>
    </article>
  `;
}

function reviewSpineSampleNumber() {
  return currentPreviewDisplay()?.sample_number || 12;
}

function previewDisplaySkinById(skinId) {
  return previewDisplaySkins.find((skin) => skin.skin_id === skinId) || previewDisplaySkins[0];
}

function previewDisplaySkinByIndex(index) {
  return previewDisplaySkins[index % previewDisplaySkins.length];
}

function previewDisplaySkinForVersion(version, index) {
  if (version?.version_id === state.currentVersionId && state.previewDisplaySkinId) return previewDisplaySkinById(state.previewDisplaySkinId);
  if (String(version?.asset_ref || "").includes("photo_studio_os")) return previewDisplaySkinById("studio_dashboard");
  return previewDisplaySkinByIndex(index);
}

function previewDisplayVersionRecord(version, index, sampleNumber) {
  const skin = previewDisplaySkinForVersion(version, index);
  return {
    preview_id: `preview-display-${safeClassToken(version.version_id)}`,
    version_id: version.version_id,
    sample_number: sampleNumber,
    label: `样片 ${sampleNumber}`,
    variant: version.label || `版本 ${String.fromCharCode(65 + index)}`,
    score: version.score,
    tone: index === state.image_versions.findIndex((item) => item.version_id === state.currentVersionId) ? "" : skin.tone,
    source_asset_ref: version.asset_ref,
    thumbnail_ref: version.thumbnail_ref || null,
    skin_id: skin.skin_id,
    skin_class: skin.skin_class,
    skin_label_cn: skin.label_cn,
    aspect_ratio: skin.aspect_ratio,
    render_mode: "css_skin_only",
    proxy_recipe_cn: skin.recipe_cn,
    static_proxy_only: true,
    asset_archive_read_performed: false,
    preview_loaded_or_rendered: false
  };
}

function previewDisplayFillerRecords() {
  return [
    { version_id: "sample-rail-static-11", sample_number: 11, variant: "备选版本 A", score: 78, skin_id: "evidence_blocker" },
    { version_id: "sample-rail-static-13", sample_number: 13, variant: "商品样片", score: 86, skin_id: "product_still_life" },
    { version_id: "sample-rail-static-14", sample_number: 14, variant: "编辑肖像", score: 82, skin_id: "editorial_portrait" },
    { version_id: "sample-rail-static-15", sample_number: 15, variant: "看板候选", score: 88, skin_id: "studio_dashboard" },
    { version_id: "sample-rail-static-16", sample_number: 16, variant: "阻断复核", score: 74, skin_id: "evidence_blocker" }
  ].map((sample) => {
    const skin = previewDisplaySkinById(sample.skin_id);
    return {
      preview_id: `preview-display-${safeClassToken(sample.version_id)}`,
      version_id: sample.version_id,
      sample_number: sample.sample_number,
      label: `样片 ${sample.sample_number}`,
      variant: sample.variant,
      score: sample.score,
      tone: skin.tone,
      source_asset_ref: "static_proxy/no_asset_archive_read",
      thumbnail_ref: null,
      skin_id: skin.skin_id,
      skin_class: skin.skin_class,
      skin_label_cn: skin.label_cn,
      aspect_ratio: skin.aspect_ratio,
      render_mode: "css_skin_only",
      proxy_recipe_cn: skin.recipe_cn,
      static_proxy_only: true,
      asset_archive_read_performed: false,
      preview_loaded_or_rendered: false
    };
  });
}

function previewDisplayVersionRecords() {
  return state.image_versions.map((version, index) => previewDisplayVersionRecord(version, index, 12 + index));
}

function previewDisplayRealPreviewRecords() {
  if (!assetArchiveRealPreviewRenderActivation.enabled) return [];
  return assetArchiveRealPreviewRenderActivation.selected_preview_refs.map((sample) => {
    const skin = previewDisplaySkinById(sample.skin_id);
    const renderedNow = assetArchiveRealPreviewRenderActivation.enabled;
    const originalRef = sample.source_original_ref || null;
    const previewRef = sample.source_preview_ref || null;
    return {
      preview_id: sample.preview_id,
      version_id: sample.version_id,
      sample_number: sample.sample_number,
      label: sample.label,
      variant: sample.variant,
      score: sample.score,
      tone: skin.tone,
      source_asset_ref: previewRef,
      source_original_ref: originalRef,
      source_preview_ref: previewRef,
      source_manifest_ref: sample.source_manifest_ref,
      thumbnail_ref: previewRef,
      stage_image_ref: previewRef,
      image_source_mode: "source_preview_ref",
      skin_id: skin.skin_id,
      skin_class: skin.skin_class,
      skin_label_cn: skin.label_cn,
      aspect_ratio: skin.aspect_ratio,
      render_mode: "asset_archive_preview_image",
      proxy_recipe_cn: "Gate-authorized exact tracked asset_archive preview render; source_original_ref is provenance only.",
      original_image_required: false,
      source_original_available: false,
      source_original_provenance_only: typeof originalRef === "string" && originalRef.length > 0,
      source_preview_available: typeof previewRef === "string" && previewRef.length > 0,
      static_proxy_only: !renderedNow,
      asset_archive_read_performed: renderedNow,
      asset_archive_ui_read_performed: renderedNow,
      browser_preview_load_performed: renderedNow,
      browser_original_image_load_performed: false,
      source_image_binary_read_performed: false,
      preview_loaded_or_rendered: renderedNow
    };
  });
}

function reviewSpineSamples() {
  const currentIndex = Math.max(0, state.image_versions.findIndex((version) => version.version_id === state.currentVersionId));
  const versionSamples = previewDisplayVersionRecords();
  return [
    ...previewDisplayRealPreviewRecords(),
    versionSamples[currentIndex],
    ...previewDisplayFillerRecords(),
    ...versionSamples.filter((_, index) => index !== currentIndex)
  ].filter(Boolean);
}

function currentPreviewDisplay() {
  const samples = reviewSpineSamples();
  return samples.find((sample) => sample.preview_id === state.previewDisplaySelectedPreviewId) ||
    samples.find((sample) => sample.version_id === state.currentVersionId) ||
    samples[0] ||
    null;
}

function currentReviewTarget(currentPreview = currentPreviewDisplay()) {
  const selectedVersion = state.image_versions.find((version) => version.version_id === currentPreview?.version_id);
  const fallbackVersion = selectedVersion || currentVersion();
  const usesAssetArchivePreview = previewDisplayUsesRealImage(currentPreview);
  const sourceAssetRef = currentPreview?.source_asset_ref || fallbackVersion?.asset_ref || "static_proxy/no_asset_archive_read";
  const outputAssetRef = usesAssetArchivePreview
    ? currentPreview.source_preview_ref || currentPreview.stage_image_ref || sourceAssetRef
    : sourceAssetRef;
  const sampleId = currentPreview?.version_id || fallbackVersion?.version_id || state.currentVersionId;
  const targetSource = usesAssetArchivePreview
    ? "selected_asset_archive_preview"
    : (selectedVersion ? "review_session_image_version" : "preview_display_static_sample");
  return {
    sample_id: sampleId,
    version_id: sampleId,
    preview_id: currentPreview?.preview_id || null,
    review_session_current_version_id: state.currentVersionId,
    sample_number: currentPreview?.sample_number || null,
    label: currentPreview?.label || null,
    variant: currentPreview?.variant || fallbackVersion?.label || null,
    score: currentPreview?.score ?? fallbackVersion?.score ?? null,
    source_asset_ref: sourceAssetRef,
    output_asset_ref: outputAssetRef,
    source_preview_ref: currentPreview?.source_preview_ref || null,
    source_original_ref: currentPreview?.source_original_ref || null,
    stage_image_ref: currentPreview?.stage_image_ref || null,
    render_mode: currentPreview?.render_mode || "review_session_image_version",
    image_source_mode: currentPreview?.image_source_mode || "review_session_image_version",
    decision_target_source: targetSource,
    uses_asset_archive_preview: usesAssetArchivePreview,
    current_version_id_aligned: sampleId === state.currentVersionId
  };
}

function previewDisplayUsesRealImage(preview) {
  return preview?.render_mode === "asset_archive_preview_image" &&
    typeof previewDisplayStageImageRef(preview) === "string" &&
    previewDisplayStageImageRef(preview).length > 0;
}

function previewDisplayStageImageRef(preview) {
  return preview?.stage_image_ref || preview?.source_preview_ref || preview?.thumbnail_ref || "";
}

function previewDisplayImageSrc(preview) {
  if (!previewDisplayUsesRealImage(preview)) return "";
  return `/${previewDisplayStageImageRef(preview)}`;
}

function previewRenderBoundaryState(currentPreview = currentPreviewDisplay()) {
  const realPreviewRecords = previewDisplayRealPreviewRecords();
  const realPreviewActive = assetArchiveRealPreviewRenderActivation.enabled;
  const selectedOriginalRefs = realPreviewRecords.map((sample) => sample.source_original_ref).filter(Boolean);
  const selectedPreviewRefs = realPreviewRecords.map((sample) => sample.source_preview_ref).filter(Boolean);
  const currentRenderRef = previewDisplayUsesRealImage(currentPreview) ? previewDisplayStageImageRef(currentPreview) : null;
  const currentRefIndex = currentRenderRef ? selectedPreviewRefs.indexOf(currentRenderRef) : -1;
  return {
    draft_output_key: "preview_render_boundary_state",
    boundary_status: realPreviewActive ? "exact_tracked_preview_refs_render_active" : "css_skin_only",
    target_surface: "review_console_review_spine",
    render_gate_ref: assetArchiveRealPreviewRenderActivation.gate_ref,
    source_mapping_ref: assetArchiveRealPreviewRenderActivation.source_mapping_ref,
    real_image_source_policy: assetArchiveRealPreviewRenderActivation.real_image_source_policy,
    selected_preview_ref_count: selectedPreviewRefs.length,
    selected_original_ref_count: selectedOriginalRefs.length,
    max_preview_refs: assetArchiveRealPreviewRenderActivation.max_preview_refs,
    max_original_refs: assetArchiveRealPreviewRenderActivation.max_original_refs,
    current_preview_ref: currentPreview?.source_preview_ref || null,
    current_original_ref: currentPreview?.source_original_ref || null,
    current_original_ref_index: null,
    current_render_ref: currentRenderRef,
    current_preview_ref_index: currentRefIndex >= 0 ? currentRefIndex + 1 : null,
    current_ref_in_exact_allowlist: currentRefIndex >= 0,
    selected_preview_refs: selectedPreviewRefs,
    selected_original_refs: selectedOriginalRefs,
    stage_zoom_percent: state.previewStageZoomPercent,
    ui_summary_cn: realPreviewActive ? `预览图 ${selectedPreviewRefs.length}/${assetArchiveRealPreviewRenderActivation.max_preview_refs} · tracked preview refs · read-only` : "CSS 皮肤预览 · no asset_archive render",
    guard: {
      exact_asset_archive_preview_refs_only: realPreviewActive,
      exact_source_original_refs_only: false,
      browser_preview_load_performed: realPreviewActive,
      browser_original_image_load_performed: false,
      preview_loaded_or_rendered: realPreviewActive,
      asset_archive_ui_read_performed: realPreviewActive,
      preview_creation_or_copy_performed: false,
      fetch_performed: false,
      file_write_performed: false,
      source_image_binary_read_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      production_candidate_write_performed: false
    }
  };
}

function previewOriginalRenderState(currentPreview = currentPreviewDisplay()) {
  const realPreviewRecords = previewDisplayRealPreviewRecords();
  const selectedOriginalRefs = realPreviewRecords.map((sample) => sample.source_original_ref).filter(Boolean);
  const selectedPreviewRefs = realPreviewRecords.map((sample) => sample.source_preview_ref).filter(Boolean);
  const currentPreviewRef = previewDisplayUsesRealImage(currentPreview) ? previewDisplayStageImageRef(currentPreview) : null;
  return {
    draft_output_key: "preview_original_render_state",
    state_status: assetArchiveRealPreviewRenderActivation.enabled ? "tracked_preview_render_active_original_refs_provenance_only" : "original_image_render_inactive",
    policy: assetArchiveRealPreviewRenderActivation.real_image_source_policy,
    selected_original_ref_count: selectedOriginalRefs.length,
    selected_preview_ref_count: selectedPreviewRefs.length,
    current_original_ref: currentPreview?.source_original_ref || null,
    current_preview_ref: currentPreviewRef,
    current_render_ref: currentPreviewRef,
    stage_zoom_percent: state.previewStageZoomPercent,
    min_zoom_percent: stageZoomRange.min,
    max_zoom_percent: stageZoomRange.max,
    zoom_step_percent: stageZoomRange.step,
    selected_original_refs: selectedOriginalRefs,
    selected_preview_refs: selectedPreviewRefs,
    preview_ref_role: "tracked_review_render_source",
    original_ref_role: "provenance_only_not_review_render_source",
    fallback_to_preview_allowed: false,
    guard: {
      browser_original_image_load_performed: false,
      browser_preview_load_performed: assetArchiveRealPreviewRenderActivation.enabled,
      source_image_binary_read_performed: false,
      preview_creation_or_copy_performed: false,
      fetch_performed: false,
      file_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      production_candidate_write_performed: false
    }
  };
}

function previewDisplayProxyState() {
  const current = currentPreviewDisplay();
  const reviewTarget = currentReviewTarget(current);
  const realRenderActive = assetArchiveRealPreviewRenderActivation.enabled;
  const realPreviewRecords = previewDisplayRealPreviewRecords();
  return {
    draft_output_key: "preview_display_state",
    execution_mode: realRenderActive ? "review_console_asset_archive_real_preview_render_activated" : "review_console_static_preview_display_proxy_only",
    source_mode: realRenderActive ? "asset_archive_exact_tracked_preview_refs_to_preview_display_state" : "review_session_image_versions_to_css_skin_proxy",
    render_activation_ref: assetArchiveRealPreviewRenderActivation.phase,
    original_render_activation_ref: assetArchiveRealPreviewRenderActivation.original_render_phase,
    render_gate_ref: assetArchiveRealPreviewRenderActivation.gate_ref,
    real_image_source_policy: assetArchiveRealPreviewRenderActivation.real_image_source_policy,
    selected_version_id: reviewTarget.version_id,
    review_session_current_version_id: state.currentVersionId,
    selected_preview_id: current?.preview_id || null,
    selected_sample_number: reviewTarget.sample_number,
    selected_asset_ref: reviewTarget.output_asset_ref,
    selected_decision_target_source: reviewTarget.decision_target_source,
    selected_skin_id: current?.skin_id || null,
    available_skin_ids: previewDisplaySkins.map((skin) => skin.skin_id),
    thumbnail_skin_count: previewDisplaySkins.length,
    real_preview_ref_count: realPreviewRecords.length,
    real_original_ref_count: realPreviewRecords.filter((sample) => sample.source_original_ref).length,
    stage_zoom_percent: state.previewStageZoomPercent,
    display_samples: reviewSpineSamples().map((sample) => ({
      preview_id: sample.preview_id,
      version_id: sample.version_id,
      sample_number: sample.sample_number,
      label: sample.label,
      variant: sample.variant,
      score: sample.score,
      skin_id: sample.skin_id,
      skin_label_cn: sample.skin_label_cn,
      aspect_ratio: sample.aspect_ratio,
      source_asset_ref: sample.source_asset_ref,
      source_preview_ref: sample.source_preview_ref || null,
      source_original_ref: sample.source_original_ref || null,
      thumbnail_ref: sample.thumbnail_ref,
      stage_image_ref: sample.stage_image_ref || null,
      image_source_mode: sample.image_source_mode || "css_skin_only",
      render_mode: sample.render_mode,
      original_image_required: sample.original_image_required === true,
      source_original_available: sample.source_original_available === true,
      static_proxy_only: sample.static_proxy_only,
      asset_archive_read_performed: sample.asset_archive_read_performed,
      asset_archive_ui_read_performed: sample.asset_archive_ui_read_performed === true,
      browser_preview_load_performed: sample.browser_preview_load_performed === true,
      browser_original_image_load_performed: sample.browser_original_image_load_performed === true,
      source_image_binary_read_performed: sample.source_image_binary_read_performed === true,
      preview_loaded_or_rendered: sample.preview_loaded_or_rendered
    })),
    guard: {
      static_proxy_only: !realRenderActive,
      css_skin_only: !realRenderActive,
      exact_asset_archive_preview_refs_only: realRenderActive,
      exact_source_original_refs_only: false,
      selected_preview_ref_count: realPreviewRecords.length,
      selected_original_ref_count: realPreviewRecords.filter((sample) => sample.source_original_ref).length,
      max_preview_refs: assetArchiveRealPreviewRenderActivation.max_preview_refs,
      max_original_refs: assetArchiveRealPreviewRenderActivation.max_original_refs,
      asset_archive_read_performed: realRenderActive,
      asset_archive_ui_read_performed: realRenderActive,
      preview_loaded_or_rendered: realRenderActive,
      browser_preview_load_performed: realRenderActive,
      browser_original_image_load_performed: false,
      preview_creation_or_copy_performed: false,
      fetch_performed: false,
      file_write_performed: false,
      source_image_binary_read_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      accepted_samples_write_performed: false,
      failure_samples_write_performed: false,
      production_candidate_write_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false
    }
  };
}

function previewStageMarkup(preview) {
  if (previewDisplayUsesRealImage(preview)) {
    const imageSrc = previewDisplayImageSrc(preview);
    const stageImageRef = previewDisplayStageImageRef(preview);
    const originalRef = preview?.source_original_ref || "";
    const previewRef = preview?.source_preview_ref || "";
    return `
      <div class="preview-image-scroll" data-preview-image-scroll>
        <img class="preview-stage-image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(preview.label)} ${escapeHtml(preview.variant)}" data-real-original-ref="${escapeHtml(originalRef)}" data-real-preview-ref="${escapeHtml(previewRef)}" data-stage-image-ref="${escapeHtml(stageImageRef)}" loading="eager" decoding="async" />
      </div>
      <span class="preview-stage-chip">${escapeHtml(preview.skin_label_cn || "预览图")} · preview</span>
    `;
  }
  return `
    <span class="stage-orbit orbit-one"></span>
    <span class="stage-orbit orbit-two"></span>
    <span class="stage-light light-one"></span>
    <span class="preview-stage-plane plane-a"></span>
    <span class="preview-stage-plane plane-b"></span>
    <span class="preview-stage-plane plane-c"></span>
    <span class="preview-stage-chip">${escapeHtml(preview?.skin_label_cn || "静态预览")}</span>
  `;
}

function renderPreviewBoundaryStrip(boundary) {
  const root = qs("#previewBoundaryStrip");
  if (!root || !boundary) return;
  const trackedPreviewActive = boundary.boundary_status === "exact_tracked_preview_refs_render_active";
  const originalPreviewActive = boundary.boundary_status === "exact_original_refs_render_active";
  const legacyExactPreviewActive = boundary.boundary_status === "exact_refs_render_active";
  const active = trackedPreviewActive || originalPreviewActive || legacyExactPreviewActive;
  const label = trackedPreviewActive ? "TRACKED PREVIEW" : active ? "ORIGINAL PREVIEW" : "CSS PREVIEW";
  const refCount = trackedPreviewActive ? boundary.selected_preview_ref_count : boundary.selected_original_ref_count || boundary.selected_preview_ref_count;
  const maxRefs = trackedPreviewActive ? boundary.max_preview_refs : boundary.max_original_refs || boundary.max_preview_refs;
  const currentRefIndex = trackedPreviewActive ? boundary.current_preview_ref_index : boundary.current_original_ref_index || boundary.current_preview_ref_index;
  root.classList.toggle("is-active", active);
  root.innerHTML = `
    <span class="preview-boundary-lede"><strong>${escapeHtml(label)}</strong>${escapeHtml(boundary.ui_summary_cn)}</span>
    <span><strong>refs</strong>${escapeHtml(refCount)} / ${escapeHtml(maxRefs)}</span>
    <span><strong>current</strong>${escapeHtml(currentRefIndex || "-")}</span>
    <span><strong>zoom</strong>${escapeHtml(boundary.stage_zoom_percent || 100)}%</span>
    <span><strong>writes</strong>${escapeHtml(boundary.guard.file_write_performed ? "on" : "off")}</span>
    <span><strong>generation</strong>${escapeHtml(boundary.guard.image_generation_performed ? "on" : "off")}</span>
  `;
}

function reviewSpineSeverityTone(severity) {
  if (severity === "hard_blocker" || severity === "critical" || severity === "high") return "danger";
  if (severity === "medium") return "warning";
  if (severity === "low") return "success";
  return "";
}

function reviewSpineStatusTone(status) {
  if (String(status || "").toLowerCase().includes("open")) return "danger";
  if (String(status || "").toLowerCase().includes("closed")) return "success";
  if (String(status || "").toLowerCase().includes("review")) return "";
  return "warning";
}

function reviewSpineActiveBlockers() {
  const focus = evidenceFocusState();
  const blockers = focus.active_blockers.length > 0 ? focus.active_blockers : [{
    id: "no-active-blocker",
    source: "review_session",
    severity: "low",
    target: currentVersion()?.version_id || state.currentVersionId,
    message: "暂无活动阻断",
    required_action: nextReviewerActionLabel(),
    anchor_id: null,
    anchor_label_cn: "审片会话"
  }];
  if (!state.selectedSpineBlockerId || !blockers.some((blocker) => blocker.id === state.selectedSpineBlockerId)) {
    state.selectedSpineBlockerId = blockers[0].id;
  }
  return blockers;
}

function sufficiencyPercent(focus) {
  const checks = focus.evidence_sufficiency.checks || [];
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
}

function renderReviewSpineV11() {
  const shellRoot = qs("#spineSampleRail");
  const decisionRoot = qs("#spineDecisionSpine");
  const triageRoot = qs("#spineTriageBar");
  const evidenceRowsRoot = qs("#spineEvidenceRows");
  const crossReferenceRoot = qs("#spineCrossReferenceDrawer");
  if (!shellRoot || !decisionRoot || !triageRoot || !evidenceRowsRoot || !crossReferenceRoot) return;

  const current = currentVersion();
  const currentPreview = currentPreviewDisplay();
  const decisionTarget = currentReviewTarget(currentPreview);
  const currentSampleNumber = reviewSpineSampleNumber();
  const focus = evidenceFocusState();
  const blockers = reviewSpineActiveBlockers();
  const selectedBlocker = blockers.find((blocker) => blocker.id === state.selectedSpineBlockerId) || blockers[0];
  const humanTotal = totalFrom(state.humanScores);
  const percent = sufficiencyPercent(focus);
  const hardCount = blockers.filter((blocker) => ["hard_blocker", "critical", "high"].includes(blocker.severity)).length;
  const mediumCount = blockers.filter((blocker) => blocker.severity === "medium").length;
  const lowCount = blockers.filter((blocker) => blocker.severity === "low").length;
  const samples = reviewSpineSamples();
  const boundaryState = previewRenderBoundaryState(currentPreview);

  qs("#spineTopSampleLabel").textContent = `样片 ${currentSampleNumber} / 48`;
  qs("#spineStageCounter").textContent = `${currentSampleNumber} / 48`;
  const zoomLabel = qs("#stageZoomLabel");
  if (zoomLabel) zoomLabel.textContent = `${state.previewStageZoomPercent}%`;
  qsa("[data-stage-zoom-out]").forEach((button) => {
    button.disabled = state.previewStageZoomPercent <= stageZoomRange.min;
  });
  qsa("[data-stage-zoom-in]").forEach((button) => {
    button.disabled = state.previewStageZoomPercent >= stageZoomRange.max;
  });

  const stage = qs(".spine-image-stage");
  const stageArt = qs(".stage-art");
  const currentUsesRealImage = previewDisplayUsesRealImage(currentPreview);
  const currentStageImageRef = currentUsesRealImage ? previewDisplayStageImageRef(currentPreview) : "";
  if (stage && currentPreview) {
    stage.className = `spine-image-stage ${safeClassToken(currentPreview.skin_class)}`;
    stage.dataset.previewProxy = currentUsesRealImage ? "asset_archive_tracked_preview_exact_render" : "static";
    stage.dataset.previewSkin = currentPreview.skin_id;
    stage.dataset.realPreviewRef = currentUsesRealImage ? currentPreview.source_preview_ref || "" : "";
    stage.dataset.realOriginalRef = currentUsesRealImage ? currentPreview.source_original_ref || "" : "";
    stage.dataset.stageImageRef = currentStageImageRef;
    stage.dataset.stageZoomPercent = String(state.previewStageZoomPercent);
  }
  if (stageArt && currentPreview) {
    stageArt.className = `stage-art preview-stage-art ${safeClassToken(currentPreview.skin_class)}${currentUsesRealImage ? " has-real-preview" : ""}`;
    stageArt.style.setProperty("--stage-zoom-scale", String(state.previewStageZoomPercent / 100));
    stageArt.style.setProperty("--stage-zoom-size", `${state.previewStageZoomPercent}%`);
    stageArt.dataset.stageZoomPercent = String(state.previewStageZoomPercent);
    stageArt.setAttribute("aria-label", currentUsesRealImage ? `${currentPreview.label} 已跟踪预览图` : `${currentPreview.skin_label_cn} 静态预览皮肤`);
    stageArt.innerHTML = previewStageMarkup(currentPreview);
  }
  renderPreviewBoundaryStrip(boundaryState);

  shellRoot.innerHTML = samples.map((sample, index) => {
    const isActive = sample.preview_id === currentPreview?.preview_id || (!currentPreview && index === 0);
    const thumb = previewDisplayUsesRealImage(sample)
      ? `<span class="spine-sample-thumb ${escapeHtml(sample.skin_class)} has-real-preview" aria-hidden="true"><img src="${escapeHtml(previewDisplayImageSrc(sample))}" alt="" data-real-original-ref="${escapeHtml(sample.source_original_ref || "")}" data-real-preview-ref="${escapeHtml(sample.source_preview_ref || "")}" data-stage-image-ref="${escapeHtml(previewDisplayStageImageRef(sample))}" loading="eager" decoding="async" /></span>`
      : `<span class="spine-sample-thumb ${escapeHtml(sample.skin_class)}" aria-hidden="true"></span>`;
    return `
      <button type="button" class="spine-sample-item${isActive ? " is-active" : ""}" data-spine-version-id="${escapeHtml(sample.version_id)}" data-preview-id="${escapeHtml(sample.preview_id)}" data-preview-skin-id="${escapeHtml(sample.skin_id)}" title="${escapeHtml(sample.skin_label_cn)} / ${escapeHtml(sample.render_mode)}">
        ${thumb}
        <span>
          <strong>${escapeHtml(sample.label)}</strong>
          <small>${escapeHtml(sample.variant)} · ${escapeHtml(sample.score)}</small>
        </span>
        <span class="spine-state-dot ${escapeHtml(sample.tone)}" aria-hidden="true"></span>
      </button>
    `;
  }).join("");

  qs("#spineStageMeta").innerHTML = `
    <span><strong>样片 ID</strong>${escapeHtml(currentPreview?.version_id || current?.version_id || state.currentVersionId)}</span>
    <span><strong>版本</strong>${escapeHtml(currentPreview?.variant || current?.label || "备选版本 B")}</span>
    <span><strong>预览代理</strong>${escapeHtml(currentPreview?.render_mode || "css_skin_only")}</span>
    <span><strong>皮肤</strong>${escapeHtml(currentPreview?.skin_label_cn || "静态预览")}</span>
    <span><strong>缩放</strong>${escapeHtml(state.previewStageZoomPercent)}%</span>
    <span><strong>来源</strong>${escapeHtml(currentStageImageRef || currentPreview?.source_asset_ref || "mock image_versions")}</span>
    <span><strong>画幅</strong>${escapeHtml(currentPreview?.aspect_ratio || "16:9")}</span>
  `;

  decisionRoot.innerHTML = `
    <section class="spine-decision-section">
      <h3>决策状态</h3>
      <span>${escapeHtml(decisionTargetDisplayLabel(decisionTarget))}</span>
      <span>${escapeHtml(decisionTargetSourceLabel(decisionTarget))} / ${escapeHtml(archiveStatusLabel(state.assetStatus))} / ${escapeHtml(memoryStatusLabel(state.memoryStatus))}</span>
    </section>
    <section class="spine-decision-section">
      <h3>待处理动作</h3>
      <ul class="spine-check-list">
        <li><span class="severity-ring square"></span><span>复核活动阻断</span><b>${escapeHtml(blockers.length)}</b></li>
        <li><span class="severity-ring square"></span><span>${escapeHtml(nextReviewerActionLabel())}</span><b>${escapeHtml(hardCount)}</b></li>
        <li><span class="severity-ring square"></span><span>补充审片备注</span><b>可选</b></li>
      </ul>
      <button type="button" class="spine-wide-button" data-open-required-actions>打开待处理动作</button>
    </section>
    <section class="spine-decision-section">
      <h3>风险动作</h3>
      <div class="risk-actions">
        <button type="button" class="risk-action low" data-risk-action="low">低风险</button>
        <button type="button" class="risk-action medium" data-risk-action="medium">中风险</button>
        <button type="button" class="risk-action high" data-risk-action="high">高风险</button>
      </div>
    </section>
    <section class="spine-decision-section">
      <h3>主要阻断</h3>
      <ul class="spine-blocker-list">
        ${blockers.slice(0, 3).map((blocker) => `
          <li>
            <span class="severity-ring ${escapeHtml(reviewSpineSeverityTone(blocker.severity))}"></span>
            <button type="button" data-spine-blocker-id="${escapeHtml(blocker.id)}">${escapeHtml(reviewBlockerMessageLabel(blocker.message))}</button>
            <b>${escapeHtml(blockerSeverityLabel(blocker.severity))}</b>
          </li>
        `).join("")}
      </ul>
      <button type="button" class="spine-wide-button" data-evidence-mode="full">查看全部活动阻断</button>
    </section>
    <section class="spine-decision-section">
      <h3>最近反馈</h3>
      <ul class="spine-feedback-list">
        <li><span class="severity-ring success"></span><span>分析员已复核</span><b>2 分钟前</b></li>
        <li><span class="severity-ring warning"></span><span>自动校验完成</span><b>15 分钟前</b></li>
      </ul>
    </section>
  `;

  triageRoot.innerHTML = `
    <div class="spine-triage-cell">
      <span><strong>活动阻断</strong><span class="metric-row"><span class="severity-ring danger"></span><b>${escapeHtml(hardCount)}</b><span class="severity-ring warning"></span><b>${escapeHtml(mediumCount)}</b><span class="severity-ring square"></span><b>${escapeHtml(blockers.length - hardCount - mediumCount - lowCount)}</b><span class="severity-ring success"></span><b>${escapeHtml(lowCount)}</b></span></span>
      <button type="button" class="icon-button" data-evidence-mode="full" aria-label="打开完整阻断">&#8250;</button>
    </div>
    <div class="spine-triage-cell">
      <span><strong>动作摘要</strong>${escapeHtml(focus.required_action.primary_action_cn)}</span>
      <button type="button" class="icon-button" data-open-required-actions aria-label="打开要求动作">&#8250;</button>
    </div>
    <div class="spine-triage-cell">
      <span><strong>证据充分度</strong><span class="sufficiency-meter"><span style="width: ${escapeHtml(percent)}%;"></span></span></span>
      <b>${escapeHtml(percent)}%</b>
    </div>
  `;

  qs("#spineWorkbenchSummary").innerHTML = `
    <span><strong>来源</strong>全部来源</span>
    <span><strong>类型</strong>全部类型</span>
    <span><strong>风险</strong>${escapeHtml(focus.active_blocker_filter.severity_cn)}</span>
    <span><strong>检索</strong>${escapeHtml(selectedBlocker?.target || "样片 12")}</span>
    <button type="button" data-evidence-mode="triage">筛选</button>
  `;

  evidenceRowsRoot.innerHTML = blockers.map((blocker) => `
    <button type="button" class="spine-evidence-row${blocker.id === state.selectedSpineBlockerId ? " is-selected" : ""}" data-spine-blocker-id="${escapeHtml(blocker.id)}" role="row">
      <span role="cell"><i class="severity-ring ${escapeHtml(reviewSpineSeverityTone(blocker.severity))}"></i> ${escapeHtml(blockerSeverityLabel(blocker.severity))}</span>
      <span role="cell">${escapeHtml(blockerSourceLabel(blocker.source))}</span>
      <span role="cell">${escapeHtml(reviewBlockerMessageLabel(blocker.message))}</span>
      <span role="cell">${escapeHtml(blocker.target)}</span>
      <span role="cell">${escapeHtml(blocker.required_action ? "待处理" : "信息")}</span>
    </button>
  `).join("");

  crossReferenceRoot.innerHTML = `
    <article class="spine-reference-card">
      <h3>${escapeHtml(reviewBlockerMessageLabel(selectedBlocker?.message || "已选阻断"))}</h3>
      <span>${escapeHtml(selectedBlocker ? blockerSeverityLabel(selectedBlocker.severity) : "信息")} / ${escapeHtml(selectedBlocker ? blockerSourceLabel(selectedBlocker.source) : "审片")}</span>
      <span>${escapeHtml(reviewActionLabel(selectedBlocker?.required_action || nextReviewerActionLabel()))}</span>
    </article>
    <article class="spine-reference-card">
      <h3>关联证据锚点</h3>
      <ul class="spine-reference-list">
        <li><span>${escapeHtml(selectedBlocker?.anchor_label_cn || "全部证据")}</span><b>&#8250;</b></li>
        <li><span>审片会话草案</span><b>&#8250;</b></li>
        <li><span>图像案例上下文</span><b>&#8250;</b></li>
      </ul>
    </article>
    <article class="spine-reference-card">
      <h3>图像案例上下文</h3>
      <span>${escapeHtml(currentPreview?.source_asset_ref || current?.asset_ref || "static_proxy/no_asset_archive_read")}</span>
      <span>${escapeHtml(currentPreview?.skin_label_cn || "静态预览")} / ${escapeHtml(currentPreview?.render_mode || "css_skin_only")}</span>
      <span>人工总分 ${escapeHtml(humanTotal)} / AI ${escapeHtml(totalFrom(null, 3))}</span>
    </article>
  `;

  qs("#spineActionSheet").classList.toggle("is-open", state.highRiskSheetOpen);
}

function selectReviewSpineSample(sample, closeDrawer = false) {
  if (!sample) return;
  const hasReviewSessionVersion = state.image_versions.some((version) => version.version_id === sample.version_id);
  if (hasReviewSessionVersion) state.currentVersionId = sample.version_id;
  state.previewDisplaySelectedPreviewId = sample.preview_id || `preview-display-${safeClassToken(sample.version_id)}`;
  state.previewDisplaySkinId = sample.skin_id || state.previewDisplaySkinId;
  if (closeDrawer) setSampleDrawerOpen(false);
  renderAll();
}

function setCurrentReviewSampleByOffset(offset) {
  const samples = reviewSpineSamples();
  if (samples.length === 0) return;
  const currentPreview = currentPreviewDisplay();
  const currentIndex = samples.findIndex((sample) => sample.preview_id === currentPreview?.preview_id);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeCurrentIndex + offset + samples.length) % samples.length;
  selectReviewSpineSample(samples[nextIndex]);
}

function setReviewSampleFromDataset(versionId, previewId, skinId) {
  const samples = reviewSpineSamples();
  const sample = samples.find((item) => item.preview_id === previewId) ||
    samples.find((item) => item.version_id === versionId) ||
    { version_id: versionId, preview_id: previewId, skin_id: skinId };
  const hasReviewSessionVersion = state.image_versions.some((version) => version.version_id === sample.version_id);
  selectReviewSpineSample({ ...sample, preview_id: previewId || sample.preview_id, skin_id: skinId || sample.skin_id }, hasReviewSessionVersion);
}

const stageZoomRange = {
  min: 50,
  max: 400,
  step: 25,
  reset: 100
};

function clampStageZoom(percent) {
  const numericPercent = Number(percent);
  if (!Number.isFinite(numericPercent)) return stageZoomRange.reset;
  return Math.min(stageZoomRange.max, Math.max(stageZoomRange.min, Math.round(numericPercent / stageZoomRange.step) * stageZoomRange.step));
}

function setPreviewStageZoom(percent) {
  state.previewStageZoomPercent = clampStageZoom(percent);
  renderReviewSpineV11();
  renderDraft();
}

function bumpPreviewStageZoom(direction) {
  setPreviewStageZoom(state.previewStageZoomPercent + direction * stageZoomRange.step);
}

function setSampleDrawerOpen(open) {
  state.sampleDrawerOpen = Boolean(open);
  if (document.body) document.body.classList.toggle("sample-drawer-open", state.sampleDrawerOpen);
}

function setHighRiskSheetOpen(open) {
  state.highRiskSheetOpen = Boolean(open);
  renderReviewSpineV11();
}

function setSelectedSpineBlocker(id) {
  state.selectedSpineBlockerId = id;
  renderReviewSpineV11();
  renderDraft();
}

function handleRiskAction(action) {
  if (action === "low") {
    setArchiveStatus("candidate");
    return;
  }
  if (action === "medium") {
    setArchiveStatus("draft");
    return;
  }
  if (action === "high") {
    setHighRiskSheetOpen(true);
  }
}

function setEvidenceMode(mode) {
  if (!["triage", "full"].includes(mode)) return;
  state.evidenceMode = mode;
  renderEvidenceFocus();
  renderReviewSpineV11();
  renderDraft();
}

function focusFullEvidenceAnchor(anchorId) {
  if (!anchorId) return;
  state.evidenceMode = "full";
  state.lastEvidenceAnchor = {
    anchor_id: anchorId,
    source: "active_blocker_filter",
    target: null,
    located: false,
    located_at: nowIso()
  };
  renderEvidenceFocus();
  renderDraft();

  window.requestAnimationFrame(() => {
    qsa(".is-evidence-anchor-target").forEach((node) => {
      node.classList.remove("is-evidence-anchor-target");
    });
    const target = document.getElementById(anchorId);
    state.lastEvidenceAnchor = {
      anchor_id: anchorId,
      source: "active_blocker_filter",
      target: target ? target.id : null,
      located: Boolean(target),
      located_at: nowIso()
    };
    if (target) {
      target.classList.add("is-evidence-anchor-target");
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.focus({ preventScroll: true });
    }
    renderDraft();
  });
}

function setActiveBlockerFilter(filterType, value) {
  if (filterType === "severity") state.blockerSeverityFilter = value || "all";
  if (filterType === "source") state.blockerSourceFilter = value || "all";
  renderEvidenceFocus();
  renderReviewSpineV11();
  renderDraft();
}

function setArchiveStatus(status) {
  state.assetStatus = status;
  state.approval.archive_action = archiveActionFor(status);
  updatePressedState("[data-archive]", "archive", status);
  recordDecisionEvent(
    "archive",
    `资产动作已更新为：${archiveStatusLabel(status)}。`,
    archiveDownstreamEffect(status)
  );
  renderDecisionStatus();
  renderEvidenceFocus();
  renderReviewSpineV11();
  renderDraft();
}

function setMemoryStatus(status) {
  state.memoryStatus = status;
  state.approval.memory_action = status === "approved" ? "approve_memory_write" : "request_memory_edit";
  if (status === "rejected") {
    state.approval.memory_action = "reject_memory_write";
  }
  updatePressedState("[data-memory]", "memory", status);
  const lock = qs("#dailyNoteLock");
  if (status === "approved") {
    lock.textContent = "DailyNote request unlocked: 仅生成已审批写入申请，仍不直接调用 DailyNote。";
    lock.classList.add("approved");
  } else {
    lock.textContent = "DailyNote locked: memory_approval.status 不是 approved。";
    lock.classList.remove("approved");
  }
  recordDecisionEvent(
    "memory",
    `记忆动作已更新为：${memoryStatusLabel(status)}。`,
    memoryDownstreamEffect(status)
  );
  renderDecisionStatus();
  renderEvidenceFocus();
  renderReviewSpineV11();
  renderDraft();
}

function renderIteration() {
  const root = qs("#iterationList");
  root.innerHTML = "";
  state.next_iteration.revision_advice_cn.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    root.appendChild(li);
  });
}

function renderProtocolHandoff() {
  const handoff = state.review_result_protocol_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_protocol_guard_summary;
  qs("#protocolSummary").innerHTML = `
    <span>Pass <strong>${escapeHtml(summary.pass_count)}</strong></span>
    <span>Reject <strong>${escapeHtml(summary.reject_count)}</strong></span>
    <span>Never production <strong>${escapeHtml(summary.never_production_count)}</strong></span>
  `;

  qs("#protocolGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory forbidden</span>
      <strong>${escapeHtml(guardSummary.memory_forbidden_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production blocked</span>
      <strong>${escapeHtml(guardSummary.production_blocked_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Negative guard</span>
      <strong>${escapeHtml(guardSummary.negative_guard_observed)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${inlineList(guardSummary.never_production_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#protocolCandidateList");
  root.innerHTML = "";
  handoff.candidate_review_results.forEach((candidate) => {
    const activeReasons = candidate.review_outcome === "pass" ? candidate.pass_reasons : candidate.reject_reasons;
    const card = document.createElement("article");
    card.className = `protocol-card ${safeClassToken(candidate.review_outcome)}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(candidate.candidate_id)}</strong>
        <span>${escapeHtml(candidate.review_outcome)}</span>
      </div>
      <ul>${listItemsHtml(activeReasons)}</ul>
      <dl>
        <div><dt>Memory</dt><dd>${escapeHtml(candidate.memory_route.route)}</dd></div>
        <div><dt>Production</dt><dd>${escapeHtml(candidate.production_route.status)}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#protocolGuard").innerHTML = `
    <span>direct memory write: ${escapeHtml(summary.direct_memory_write_performed)}</span>
    <span>production candidate created: ${escapeHtml(summary.production_candidate_created)}</span>
    <span>all production creation blocked: ${escapeHtml(guardSummary.all_production_candidate_creation_blocked)}</span>
    <span>memory forbidden ids: ${inlineList(guardSummary.memory_forbidden_candidate_ids)}</span>
  `;
}

function renderDecisionPackageHandoff() {
  const handoff = state.review_decision_package_static_handoff;
  const summary = handoff.decision_summary;
  const guardSummary = handoff.review_decision_package_guard_summary;
  qs("#decisionPackageSummary").innerHTML = `
    <span>Accepted drafts <strong>${escapeHtml(summary.accepted_sample_draft_count)}</strong></span>
    <span>Rejected drafts <strong>${escapeHtml(summary.rejected_sample_draft_count)}</strong></span>
    <span>Memory drafts <strong>${escapeHtml(summary.memory_delta_draft_count)}</strong></span>
    <span>Production exclusions <strong>${escapeHtml(summary.production_exclusion_count)}</strong></span>
  `;

  qs("#decisionPackageGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Accepted samples write</span>
      <strong>${escapeHtml(guardSummary.accepted_samples_write_performed)}</strong>
    </article>
    <article class="guard-tile">
      <span>Direct memory write</span>
      <strong>${escapeHtml(guardSummary.direct_memory_write_performed)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${escapeHtml(guardSummary.production_candidate_created)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion ids</span>
      <strong>${inlineList(guardSummary.production_exclusion_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#decisionPackageDraftList");
  root.innerHTML = "";
  const draftGroups = [
    {
      label: "Accepted sample drafts",
      items: handoff.accepted_sample_drafts.map((draft) => ({
        id: draft.accepted_sample_id,
        meta: draft.candidate_id,
        status: `write=${draft.write_performed} production=${draft.production_candidate}`
      }))
    },
    {
      label: "Rejected sample drafts",
      items: handoff.rejected_sample_drafts.map((draft) => ({
        id: draft.rejected_sample_id,
        meta: draft.candidate_id,
        status: `write=${draft.write_performed} production=${draft.production_candidate}`
      }))
    },
    {
      label: "Memory delta drafts",
      items: handoff.memory_delta_drafts.map((draft) => ({
        id: draft.memory_delta_id,
        meta: draft.language,
        status: `status=${draft.status} direct_write=${draft.direct_write_performed}`
      }))
    },
    {
      label: "Production exclusion register",
      items: handoff.production_exclusion_register.map((record) => ({
        id: record.candidate_id,
        meta: record.status,
        status: `permanent=${record.permanent_block} production=${record.production_candidate}`
      }))
    }
  ];

  draftGroups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "decision-package-card";
    card.innerHTML = `
      <strong>${escapeHtml(group.label)}</strong>
      <ul>
        ${group.items.map((item) => `<li><span>${escapeHtml(item.id)}</span><small>${escapeHtml(item.meta)} · ${escapeHtml(item.status)}</small></li>`).join("")}
      </ul>
    `;
    root.appendChild(card);
  });

  qs("#decisionPackageGuard").innerHTML = `
    <span>protocol pass is not production approval: ${escapeHtml(handoff.promotion_guard.protocol_pass_is_not_production_approval)}</span>
    <span>every never-production candidate blocked: ${escapeHtml(handoff.promotion_guard.every_never_production_candidate_blocked)}</span>
    <span>memory forbidden count: ${escapeHtml(summary.memory_forbidden_count)}</span>
  `;
}

function renderEvidenceBlockerHandoff() {
  const handoff = state.review_evidence_blocker_contract_static_handoff;
  const summary = handoff.blocker_summary;
  const guardSummary = handoff.review_evidence_blocker_contract_guard_summary;
  qs("#evidenceBlockerSummary").innerHTML = `
    <span>Evidence records <strong>${escapeHtml(summary.evidence_record_count)}</strong></span>
    <span>Blocker decisions <strong>${escapeHtml(summary.blocker_decision_count)}</strong></span>
    <span>Permanent blocks <strong>${escapeHtml(summary.permanent_block_count)}</strong></span>
    <span>Human review blocks <strong>${escapeHtml(summary.human_review_block_count)}</strong></span>
  `;

  qs("#evidenceBlockerGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Production exclusions</span>
      <strong>${escapeHtml(guardSummary.production_exclusion_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Memory forbidden blocks</span>
      <strong>${escapeHtml(guardSummary.memory_forbidden_block_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${escapeHtml(guardSummary.production_candidate_created)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion ids</span>
      <strong>${inlineList(guardSummary.production_exclusion_candidate_ids)}</strong>
    </article>
  `;

  const evidenceRoot = qs("#evidenceRecordList");
  evidenceRoot.innerHTML = "";
  handoff.evidence_records.forEach((record) => {
    const card = document.createElement("article");
    card.className = `evidence-card ${safeClassToken(record.review_outcome)}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(record.candidate_id)}</strong>
        <span>${escapeHtml(record.review_outcome)}</span>
      </div>
      <ul>${listItemsHtml(record.evidence_codes)}</ul>
      <dl>
        <div><dt>Production candidate</dt><dd>${escapeHtml(record.production_candidate)}</dd></div>
        <div><dt>Direct write</dt><dd>${escapeHtml(record.direct_write_performed)}</dd></div>
      </dl>
    `;
    evidenceRoot.appendChild(card);
  });

  const blockerRoot = qs("#blockerDecisionList");
  blockerRoot.innerHTML = "";
  handoff.blocker_decisions.forEach((blocker) => {
    const card = document.createElement("article");
    card.className = `blocker-card ${blocker.permanent_block ? "permanent" : "temporary"}`;
    card.id = evidenceBlockerAnchorId(blocker);
    card.tabIndex = -1;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(blocker.candidate_id)}</strong>
        <span>${escapeHtml(blocker.decision)}</span>
      </div>
      <dl>
        <div><dt>Type</dt><dd>${escapeHtml(blocker.blocker_type)}</dd></div>
        <div><dt>Scope</dt><dd>${escapeHtml(blocker.blocking_scope)}</dd></div>
        <div><dt>Permanent</dt><dd>${escapeHtml(blocker.permanent_block)}</dd></div>
        <div><dt>Production candidate</dt><dd>${escapeHtml(blocker.production_candidate)}</dd></div>
      </dl>
    `;
    blockerRoot.appendChild(card);
  });

  qs("#evidenceBlockerGuard").innerHTML = `
    <span>evidence record is not approval: ${escapeHtml(handoff.arbitration_guard.evidence_record_is_not_approval)}</span>
    <span>blocker decision is not write: ${escapeHtml(handoff.arbitration_guard.blocker_decision_is_not_write)}</span>
    <span>every candidate has evidence record: ${escapeHtml(handoff.arbitration_guard.every_candidate_has_evidence_record)}</span>
    <span>every candidate has production blocker: ${escapeHtml(handoff.arbitration_guard.every_candidate_has_production_blocker_decision)}</span>
    <span>every never-production candidate has exclusion: ${escapeHtml(handoff.arbitration_guard.every_never_production_candidate_has_exclusion)}</span>
    <span>no production without human review: ${escapeHtml(handoff.arbitration_guard.no_production_without_human_review)}</span>
  `;
}

function renderReviewBlockerArbiterHandoff() {
  const handoff = state.review_blocker_arbiter_static_handoff;
  const summary = handoff.arbiter_summary;
  const guardSummary = handoff.review_blocker_arbiter_guard_summary;

  qs("#blockerArbiterSummary").innerHTML = `
    <span>Candidates <strong>${escapeHtml(summary.candidate_count)}</strong></span>
    <span>Production blocked <strong>${escapeHtml(summary.production_blocked_count)}</strong></span>
    <span>Human review <strong>${escapeHtml(summary.human_review_required_count)}</strong></span>
    <span>Permanent blocks <strong>${escapeHtml(summary.permanent_block_count)}</strong></span>
  `;

  qs("#blockerArbiterGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory forbidden</span>
      <strong>${escapeHtml(guardSummary.memory_forbidden_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Never production</span>
      <strong>${escapeHtml(guardSummary.never_production_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${escapeHtml(guardSummary.production_candidate_created)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${inlineList(guardSummary.never_production_candidate_ids)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production blocked ids</span>
      <strong>${inlineList(handoff.production_blocked_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#blockerArbiterRouteList");
  root.innerHTML = "";
  handoff.candidate_arbitrations.forEach((item) => {
    const card = document.createElement("article");
    card.className = `blocker-arbiter-card ${item.never_production ? "never-production" : "human-review"}`;
    card.id = blockerArbiterAnchorId(item);
    card.tabIndex = -1;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(item.candidate_id)}</strong>
        <span>${escapeHtml(item.final_route)}</span>
      </div>
      <dl>
        <div><dt>Evidence</dt><dd>${escapeHtml(item.evidence_record_id)}</dd></div>
        <div><dt>Production blocker</dt><dd>${escapeHtml(item.production_blocker_decision_id)}</dd></div>
        <div><dt>Production decision</dt><dd>${escapeHtml(item.production_decision)}</dd></div>
        <div><dt>Memory decision</dt><dd>${escapeHtml(item.memory_decision)}</dd></div>
        <div><dt>Memory forbidden</dt><dd>${escapeHtml(item.memory_forbidden)}</dd></div>
        <div><dt>Never production</dt><dd>${escapeHtml(item.never_production)}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#blockerArbiterGuard").innerHTML = `
    <span>review blocker arbiter attached: ${escapeHtml(handoff.review_blocker_arbiter_attached)}</span>
    <span>production promotion allowed now: ${escapeHtml(guardSummary.production_promotion_allowed_now)}</span>
    <span>memory entry allowed now: ${escapeHtml(guardSummary.memory_entry_allowed_now)}</span>
    <span>memory forbidden prevents memory: ${escapeHtml(guardSummary.memory_forbidden_prevents_memory)}</span>
    <span>never production prevents production: ${escapeHtml(guardSummary.never_production_prevents_production)}</span>
    <span>pass is not production approval: ${escapeHtml(handoff.promotion_guard.pass_is_not_production_approval)}</span>
    <span>human review required before production: ${escapeHtml(guardSummary.human_review_required_before_production)}</span>
    <span>all writes blocked: ${escapeHtml(summary.all_writes_blocked)}</span>
  `;
}

function renderReviewReportHandoff() {
  const handoff = state.review_report_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_report_guard_summary;

  qs("#reviewReportSummary").innerHTML = `
    <span>ReviewReport <strong>${escapeHtml(handoff.review_report_contract_attached)}</strong></span>
    <span>Candidates <strong>${escapeHtml(summary.candidate_count)}</strong></span>
    <span>Pass <strong>${escapeHtml(summary.pass_count)}</strong></span>
    <span>Reject <strong>${escapeHtml(summary.reject_count)}</strong></span>
    <span>Never production <strong>${escapeHtml(summary.never_production_count)}</strong></span>
  `;

  qs("#reviewReportGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory entries now</span>
      <strong>${escapeHtml(guardSummary.memory_entry_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production promotions now</span>
      <strong>${escapeHtml(guardSummary.production_promotion_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Writes allowed now</span>
      <strong>${escapeHtml(guardSummary.writes_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${inlineList(guardSummary.never_production_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#reviewReportItemList");
  root.innerHTML = "";
  handoff.report_items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `review-report-card ${item.production_report.never_production ? "never-production" : "pending-review"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(item.candidate_id)}</strong>
        <span>${escapeHtml(item.report_decision)}</span>
      </div>
      <dl>
        <div><dt>Review outcome</dt><dd>${escapeHtml(item.review_outcome)}</dd></div>
        <div><dt>Final route</dt><dd>${escapeHtml(item.final_route)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(item.evidence_record_id)}</dd></div>
        <div><dt>Production blocker</dt><dd>${escapeHtml(item.production_blocker_decision_id)}</dd></div>
        <div><dt>Memory output</dt><dd>${escapeHtml(item.memory_report.allowed_output_now)}</dd></div>
        <div><dt>Production output</dt><dd>${escapeHtml(item.production_report.allowed_output_now)}</dd></div>
        <div><dt>Memory now</dt><dd>${escapeHtml(item.memory_report.memory_entry_allowed_now)}</dd></div>
        <div><dt>Production now</dt><dd>${escapeHtml(item.production_report.production_promotion_allowed_now)}</dd></div>
        <div><dt>Never production</dt><dd>${escapeHtml(item.production_report.never_production)}</dd></div>
        <div><dt>Writes blocked</dt><dd>${inlineList(item.final_controls.writes_blocked)}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#reviewReportGuard").innerHTML = `
    <span>all report items explain candidates: ${escapeHtml(summary.report_items_explain_all_candidates)}</span>
    <span>all memory writes blocked: ${escapeHtml(summary.all_memory_writes_blocked)}</span>
    <span>all production writes blocked: ${escapeHtml(summary.all_production_writes_blocked)}</span>
    <span>all provider execution blocked: ${escapeHtml(summary.all_provider_execution_blocked)}</span>
    <span>DailyNote write: ${escapeHtml(guardSummary.daily_note_write_performed)}</span>
    <span>VCP memory write: ${escapeHtml(guardSummary.vcp_memory_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(guardSummary.accepted_samples_write_performed)}</span>
    <span>production candidate created: ${escapeHtml(guardSummary.production_candidate_created)}</span>
  `;
}

function renderNegativeReviewReportHandoff() {
  const handoff = state.review_report_negative_guard_static_handoff;
  const summary = handoff.report_summary;
  const guardSummary = handoff.review_report_guard_summary;

  qs("#negativeReviewReportSummary").innerHTML = `
    <span>Negative ReviewReport <strong>${escapeHtml(handoff.negative_guard_observed)}</strong></span>
    <span>Candidates <strong>${escapeHtml(summary.candidate_count)}</strong></span>
    <span>Reject <strong>${escapeHtml(summary.reject_count)}</strong></span>
    <span>Memory forbidden <strong>${escapeHtml(guardSummary.memory_forbidden_candidate_ids.length)}</strong></span>
    <span>Never production <strong>${escapeHtml(summary.never_production_count)}</strong></span>
  `;

  qs("#negativeReviewReportGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Memory entries now</span>
      <strong>${escapeHtml(guardSummary.memory_entry_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production promotions now</span>
      <strong>${escapeHtml(guardSummary.production_promotion_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Writes allowed now</span>
      <strong>${escapeHtml(guardSummary.writes_allowed_now_count)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Memory forbidden ids</span>
      <strong>${inlineList(guardSummary.memory_forbidden_candidate_ids)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Never production ids</span>
      <strong>${inlineList(guardSummary.never_production_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#negativeReviewReportItemList");
  root.innerHTML = "";
  handoff.report_items.forEach((item) => {
    const card = document.createElement("article");
    const statusClass = item.memory_report.memory_forbidden ? "memory-forbidden" : "never-production";
    card.className = `review-report-card ${statusClass}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(item.candidate_id)}</strong>
        <span>${escapeHtml(item.report_decision)}</span>
      </div>
      <dl>
        <div><dt>Review outcome</dt><dd>${escapeHtml(item.review_outcome)}</dd></div>
        <div><dt>Final route</dt><dd>${escapeHtml(item.final_route)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(item.evidence_record_id)}</dd></div>
        <div><dt>Production blocker</dt><dd>${escapeHtml(item.production_blocker_decision_id)}</dd></div>
        <div><dt>Memory blockers</dt><dd>${inlineList(item.memory_blocker_decision_ids)}</dd></div>
        <div><dt>Failure tags</dt><dd>${inlineList(item.failure_tags)}</dd></div>
        <div><dt>Unknown failure tags</dt><dd>${inlineList(item.unknown_failure_tags)}</dd></div>
        <div><dt>Memory output</dt><dd>${escapeHtml(item.memory_report.allowed_output_now)}</dd></div>
        <div><dt>Production output</dt><dd>${escapeHtml(item.production_report.allowed_output_now)}</dd></div>
        <div><dt>Memory forbidden</dt><dd>${escapeHtml(item.memory_report.memory_forbidden)}</dd></div>
        <div><dt>Never production</dt><dd>${escapeHtml(item.production_report.never_production)}</dd></div>
        <div><dt>Writes allowed now</dt><dd>${escapeHtml(item.final_controls.writes_allowed_now.length)}</dd></div>
        <div><dt>Execution blocked</dt><dd>${inlineList(item.final_controls.execution_blocked)}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#negativeReviewReportGuard").innerHTML = `
    <span>all report items explain candidates: ${escapeHtml(summary.report_items_explain_all_candidates)}</span>
    <span>all memory writes blocked: ${escapeHtml(summary.all_memory_writes_blocked)}</span>
    <span>all production writes blocked: ${escapeHtml(summary.all_production_writes_blocked)}</span>
    <span>all provider execution blocked: ${escapeHtml(summary.all_provider_execution_blocked)}</span>
    <span>DailyNote write: ${escapeHtml(guardSummary.daily_note_write_performed)}</span>
    <span>VCP memory write: ${escapeHtml(guardSummary.vcp_memory_write_performed)}</span>
    <span>accepted_samples write: ${escapeHtml(guardSummary.accepted_samples_write_performed)}</span>
    <span>production candidate created: ${escapeHtml(guardSummary.production_candidate_created)}</span>
  `;
}

function renderAdapterNegativeHandoff() {
  const handoff = state.review_evidence_blocker_adapter_negative_static_handoff;
  const guard = handoff.guard_summary;
  const audit = handoff.audit_summary;

  qs("#adapterNegativeSummary").innerHTML = `
    <span>Adapter negative fixture <strong>${escapeHtml(handoff.adapter_negative_guard_observed)}</strong></span>
    <span>Golden fixture match <strong>${escapeHtml(handoff.evidence_blocker_contract_matches_fixture)}</strong></span>
    <span>Never production <strong>${escapeHtml(audit.never_production_count)}</strong></span>
    <span>Memory forbidden <strong>${escapeHtml(audit.memory_forbidden_count)}</strong></span>
  `;

  qs("#adapterNegativeGuardSummary").innerHTML = `
    <article class="guard-tile">
      <span>Production exclusions</span>
      <strong>${escapeHtml(guard.production_exclusion_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Memory forbidden blocks</span>
      <strong>${escapeHtml(guard.memory_forbidden_block_count)}</strong>
    </article>
    <article class="guard-tile">
      <span>Production candidate</span>
      <strong>${escapeHtml(guard.production_candidate_created)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Memory forbidden IDs</span>
      <strong>${inlineList(handoff.memory_forbidden_candidate_ids)}</strong>
    </article>
    <article class="guard-tile wide">
      <span>Production exclusion IDs</span>
      <strong>${inlineList(handoff.production_exclusion_candidate_ids)}</strong>
    </article>
  `;

  const root = qs("#adapterNegativeBlockerList");
  root.innerHTML = "";
  handoff.blocker_highlights.forEach((item) => {
    const card = document.createElement("article");
    card.className = `adapter-negative-card ${item.memory_route === "forbidden" ? "memory-forbidden" : "never-production"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(item.candidate_id)}</strong>
        <span>${escapeHtml(item.decision)}</span>
      </div>
      <dl>
        <div><dt>Memory route</dt><dd>${escapeHtml(item.memory_route)}</dd></div>
        <div><dt>Production route</dt><dd>${escapeHtml(item.production_route)}</dd></div>
        <div><dt>Blocker</dt><dd>${escapeHtml(item.blocker_type)}</dd></div>
        <div><dt>Direct write</dt><dd>${escapeHtml(item.direct_write_performed)}</dd></div>
      </dl>
    `;
    root.appendChild(card);
  });

  qs("#adapterNegativeGuard").innerHTML = `
    <span>embedded evidence blocker contract: ${escapeHtml(handoff.evidence_blocker_contract_embedded)}</span>
    <span>matches golden fixture: ${escapeHtml(handoff.evidence_blocker_contract_matches_fixture)}</span>
    <span>every candidate has evidence record: ${escapeHtml(guard.every_candidate_has_evidence_record)}</span>
    <span>every candidate has production blocker: ${escapeHtml(guard.every_candidate_has_production_blocker_decision)}</span>
    <span>every never-production candidate has exclusion: ${escapeHtml(guard.every_never_production_candidate_has_exclusion)}</span>
    <span>selected plugin: ${escapeHtml(audit.selected_plugin)}</span>
    <span>max plugin calls: ${escapeHtml(audit.max_plugin_calls_observed)}</span>
  `;
}

function failureStateStaticWorkbenchState() {
  const negativeReport = state.review_report_negative_guard_static_handoff;
  const adapterNegative = state.review_evidence_blocker_adapter_negative_static_handoff;
  const failureCapsule = state.portable_failure_capsule_evidence;
  const failureCapsules = state.portable_failure_capsule_evidence_list || (failureCapsule ? [failureCapsule] : []);
  const records = negativeReport.report_items.map((item) => ({
    candidate_id: item.candidate_id,
    shot_id: item.shot_id,
    review_outcome: item.review_outcome,
    final_route: item.final_route,
    failure_tags: item.failure_tags || [],
    unknown_failure_tags: item.unknown_failure_tags || [],
    memory_forbidden: item.memory_report.memory_forbidden === true,
    never_production: item.production_report.never_production === true,
    production_exclusion_record_id: item.production_exclusion_record_id || null,
    memory_allowed_output_now: item.memory_report.allowed_output_now,
    production_allowed_output_now: item.production_report.allowed_output_now,
    writes_allowed_now_count: item.final_controls.writes_allowed_now.length,
    execution_blocked: item.final_controls.execution_blocked || []
  }));
  const memoryForbiddenRecords = records.filter((record) => record.memory_forbidden);
  const neverProductionRecords = records.filter((record) => record.never_production);
  const productionExclusionRecords = records.filter((record) => record.production_exclusion_record_id);
  return {
    phase: "v14_227_review_console_failure_state_static_workbench",
    execution_mode: "review_console_static_failure_state_only",
    draft_output_key: "failure_state_static_workbench_state",
    source_negative_review_report_ref: "review_console/static_prototype/mock_data.js#review_report_negative_guard_static_handoff",
    source_adapter_negative_ref: "review_console/static_prototype/mock_data.js#review_evidence_blocker_adapter_negative_static_handoff",
    failure_candidate_count: records.length,
    memory_forbidden_count: memoryForbiddenRecords.length,
    never_production_count: neverProductionRecords.length,
    production_exclusion_count: productionExclusionRecords.length,
    failure_samples_state: "static_review_only_not_written",
    failure_samples_write_allowed: false,
    failure_samples_write_performed: false,
    portable_failure_capsule_count: failureCapsules.length,
    portable_failure_capsule_ids: failureCapsules.map((capsule) => capsule.sample_id),
    portable_failure_capsule_records: failureCapsules.map((capsule) => ({
      sample_id: capsule.sample_id,
      capsule_root: capsule.capsule_root,
      manifest_ref: capsule.manifest_ref,
      preview_ref: capsule.preview_ref,
      failure_record_ref: capsule.failure_record_ref,
      review_record_ref: capsule.review_record_ref,
      preview_format: capsule.preview_format,
      preview_long_edge: capsule.preview_long_edge,
      preview_dimensions: capsule.preview_dimensions,
      preview_sha256: capsule.preview_sha256,
      clone_portable_validation_status: capsule.clone_portable_validation_status,
      registry_validator_status: capsule.registry_validator_status,
      final_route: capsule.final_route,
      failure_tags: capsule.failure_tags || [],
      resolved_by_accepted_sample: capsule.resolved_by_accepted_sample,
      source_original_required_for_portable_validation: capsule.source_original_required_for_portable_validation === true,
      old_source_present_in_clean_clone: capsule.old_source_present_in_clean_clone === true,
      base64_evidence_used: capsule.base64_evidence_used === true,
      production_candidate_allowed: capsule.production_candidate_allowed === true,
      memory_write_allowed: capsule.memory_write_allowed === true,
      DailyNote_write_allowed: capsule.DailyNote_write_allowed === true
    })),
    memory_forbidden_candidate_ids: memoryForbiddenRecords.map((record) => record.candidate_id),
    never_production_candidate_ids: neverProductionRecords.map((record) => record.candidate_id),
    production_exclusion_candidate_ids: adapterNegative.production_exclusion_candidate_ids || productionExclusionRecords.map((record) => record.candidate_id),
    records,
    guard: {
      local_static_workbench_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      category_index_write_performed: false,
      failure_samples_write_performed: false,
      production_candidate_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      mcp_runtime_performed: false,
      image_generation_performed: false,
      env_or_secret_read_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
      failure_state_is_not_failure_samples_registry_write: true,
      artifact_recoverability_is_not_vcp_runtime_integration: true,
      vcp_runtime_integration_proven: false
    }
  };
}

function renderFailureStateStaticWorkbench() {
  const failureState = failureStateStaticWorkbenchState();
  qs("#failureStateSummary").innerHTML = `
    <span>failure candidates <strong>${escapeHtml(failureState.failure_candidate_count)}</strong></span>
    <span>memory forbidden <strong>${escapeHtml(failureState.memory_forbidden_count)}</strong></span>
    <span>never production <strong>${escapeHtml(failureState.never_production_count)}</strong></span>
    <span>portable capsules <strong>${escapeHtml(failureState.portable_failure_capsule_count)}</strong></span>
    <span>failure_samples write <strong>${escapeHtml(failureState.failure_samples_write_performed)}</strong></span>
  `;
  const reviewCards = failureState.records.map((record) => `
    <article class="failure-state-card ${record.memory_forbidden ? "memory-forbidden" : "never-production"}">
      <div class="protocol-card-head">
        <strong>${escapeHtml(record.candidate_id)}</strong>
        <span>${escapeHtml(record.final_route)}</span>
      </div>
      <dl>
        <div><dt>Failure tags</dt><dd>${inlineList(record.failure_tags)}</dd></div>
        <div><dt>Unknown tags</dt><dd>${inlineList(record.unknown_failure_tags)}</dd></div>
        <div><dt>Memory forbidden</dt><dd>${escapeHtml(record.memory_forbidden)}</dd></div>
        <div><dt>Never production</dt><dd>${escapeHtml(record.never_production)}</dd></div>
        <div><dt>Production exclusion</dt><dd>${escapeHtml(record.production_exclusion_record_id || "none")}</dd></div>
        <div><dt>Memory output</dt><dd>${escapeHtml(record.memory_allowed_output_now)}</dd></div>
        <div><dt>Production output</dt><dd>${escapeHtml(record.production_allowed_output_now)}</dd></div>
        <div><dt>Writes allowed now</dt><dd>${escapeHtml(record.writes_allowed_now_count)}</dd></div>
      </dl>
    </article>
  `).join("");
  const capsuleCards = failureState.portable_failure_capsule_records.map((capsule) => `
    <article class="failure-state-card never-production">
      <div class="protocol-card-head">
        <strong>${escapeHtml(capsule.sample_id)}</strong>
        <span>${escapeHtml(capsule.final_route)}</span>
      </div>
      <dl>
        <div><dt>Capsule root</dt><dd>${escapeHtml(capsule.capsule_root)}</dd></div>
        <div><dt>Manifest</dt><dd>${escapeHtml(capsule.manifest_ref)}</dd></div>
        <div><dt>Preview</dt><dd>${escapeHtml(capsule.preview_ref)}</dd></div>
        <div><dt>Preview spec</dt><dd>${escapeHtml(`${capsule.preview_format} ${capsule.preview_dimensions} long_edge=${capsule.preview_long_edge}`)}</dd></div>
        <div><dt>Preview hash</dt><dd>${escapeHtml(capsule.preview_sha256.slice(0, 12))}</dd></div>
        <div><dt>Failure record</dt><dd>${escapeHtml(capsule.failure_record_ref)}</dd></div>
        <div><dt>Review record</dt><dd>${escapeHtml(capsule.review_record_ref)}</dd></div>
        <div><dt>Failure tags</dt><dd>${inlineList(capsule.failure_tags)}</dd></div>
        <div><dt>Resolved by</dt><dd>${escapeHtml(capsule.resolved_by_accepted_sample)}</dd></div>
        <div><dt>Clone portable</dt><dd>${escapeHtml(capsule.clone_portable_validation_status)}</dd></div>
        <div><dt>Old source in clone</dt><dd>${escapeHtml(capsule.old_source_present_in_clean_clone)}</dd></div>
        <div><dt>Production allowed</dt><dd>${escapeHtml(capsule.production_candidate_allowed)}</dd></div>
        <div><dt>Memory write allowed</dt><dd>${escapeHtml(capsule.memory_write_allowed)}</dd></div>
      </dl>
    </article>
  `).join("");
  qs("#failureStateBody").innerHTML = reviewCards + capsuleCards;
  qs("#failureStateGuard").innerHTML = `
    <span>static workbench: ${escapeHtml(failureState.guard.local_static_workbench_only)}</span>
    <span>failure_samples write: ${escapeHtml(failureState.guard.failure_samples_write_performed)}</span>
    <span>production candidate: ${escapeHtml(failureState.guard.production_candidate_write_performed)}</span>
    <span>DailyNote write: ${escapeHtml(failureState.guard.DailyNote_write_performed)}</span>
    <span>VCP runtime proven: ${escapeHtml(failureState.guard.vcp_runtime_integration_proven)}</span>
  `;
}

function approvalPayload() {
  if (state.memoryStatus === "approved") {
    return {
      status: "approved",
      approved_by: "human_reviewer",
      approved_at: nowIso(),
      rejection_reason_cn: null
    };
  }
  if (state.memoryStatus === "rejected") {
    return {
      status: "rejected",
      approved_by: null,
      approved_at: null,
      rejection_reason_cn: "记忆正文仍需人工改写后再提交。"
    };
  }
  return {
    status: "pending",
    approved_by: null,
    approved_at: null,
    rejection_reason_cn: null
  };
}

function memoryWriteMode(memoryApproval) {
  if (memoryApproval.status === "approved") return "draft";
  if (memoryApproval.status === "rejected") return "forbidden";
  return "draft";
}

function buildReviewSession(memoryApproval, humanTotal) {
  const reviewTarget = currentReviewTarget();
  return {
    session_id: state.session_id,
    task_id: state.task_id,
    case_id: state.case_id,
    project: state.project,
    status: state.status,
    image_versions: state.image_versions,
    current_version_id: state.currentVersionId,
    current_preview_id: reviewTarget.preview_id,
    current_review_target: reviewTarget,
    compare_version_id: state.compareVersionId,
    ai_review: {
      ...state.ai_review,
      total_score: totalFrom(null, 3),
      note_cn: "AI 初评仅供参考，人工评分覆盖 AI 评分。"
    },
    human_review: {
      ...state.human_review,
      total_score: humanTotal,
      breakdown: state.humanScores
    },
    final_review: {
      source: "human_review",
      total_score: humanTotal,
      rule_cn: "final_review 必须优先采用 human_review。"
    },
    comments: state.comments,
    annotation_notes: state.annotation_notes,
    version_comparison: state.version_comparison,
    approval: state.approval,
    archive_decision: {
      asset_status: state.assetStatus,
      static_draft_only: true,
      human_approval_required: true,
      ai_archive_recommendation_is_final: false,
      archive_persistence_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      note_cn: "AI 的 archive_recommendation 只是建议，不能替代人工批准。"
    },
    memory_preview: {
      chinese_diary_title: qs("#memoryTitle").value,
      chinese_diary_content: qs("#memoryContent").value,
      target_notebook: state.memory_preview.target_notebook,
      maid: state.memory_preview.maid,
      tags: state.memory_preview.tags,
      safety: state.memory_preview.safety
    },
    memory_approval: memoryApproval,
    next_iteration: state.next_iteration,
    audit_log: [
      ...state.audit_log,
      {
        event: "static_draft_rendered",
        actor: "Review_Console_Static_Prototype",
        created_at: nowIso(),
        note_cn: "仅在浏览器内刷新草案文本，未调用 DailyNote、API 或 VCP 插件。"
      }
    ]
  };
}

function buildImageCase(humanTotal) {
  const approvedAsset = state.assetStatus === "accepted";
  const reviewTarget = currentReviewTarget();
  return {
    case_id: state.case_id,
    project: state.project,
    task_id: state.task_id,
    image_type: "Photo Studio OS dashboard",
    input_assets: mock.image_case_seed.input_assets,
    output_assets: [reviewTarget.output_asset_ref],
    selected_review_target: reviewTarget,
    plugin_used: null,
    prompt_package_id: mock.image_case_seed.prompt_package_id,
    review_ids: mock.image_case_seed.review_ids,
    final_score: humanTotal,
    asset_status: state.assetStatus,
    human_approval: {
      approved: false,
      approved_in_static_draft: approvedAsset,
      static_draft_only: true,
      approval_persistence_performed: false,
      accepted_samples_write_performed: false,
      approved_by: null,
      approved_at: null,
      approval_notes_cn: approvedAsset ? "浏览器草案已选择 accepted；真实批准仍需外部审批和持久化。" : "未人工批准，不能标记 accepted。"
    },
    strengths_cn: mock.image_case_seed.strengths_cn,
    weaknesses_cn: mock.image_case_seed.weaknesses_cn,
    reusable_rules_cn: mock.image_case_seed.reusable_rules_cn,
    memory_entries: ["delta-photo-studio-os-review-001"],
    git_promotion_candidate: false
  };
}

function buildMemoryDelta(memoryApproval) {
  const writeMode = memoryWriteMode(memoryApproval);
  const reviewTarget = currentReviewTarget();
  return {
    delta_id: "delta-photo-studio-os-review-001",
    task_id: state.task_id,
    case_id: state.case_id,
    created_at: nowIso(),
    agent_name: "Review_Console_Static_Prototype",
    agent_role: "static_review_console_mock",
    project: state.project,
    memory_type: "style_review_lesson",
    target_notebook: state.memory_preview.target_notebook,
    write_mode: writeMode,
    importance: "medium",
    approval_required: true,
    approval_status: memoryApproval.status,
    approved_by: memoryApproval.approved_by,
    approved_at: memoryApproval.approved_at,
    static_draft_only: true,
    memory_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    source: {
      source_type: "review_session_static_prototype",
      source_ids: [state.session_id, state.case_id]
    },
    chinese_diary_title: qs("#memoryTitle").value,
    chinese_diary_content: qs("#memoryContent").value,
    preserved_original: {
      prompt_en: null,
      plugin_name: null,
      model_name: null,
      file_ref: reviewTarget.output_asset_ref,
      selected_review_target: reviewTarget
    },
    tags: state.memory_preview.tags,
    visibility: "audit",
    memory_safety: {
      ...state.memory_preview.safety,
      safety_notes_cn: "静态原型 mock 数据不包含密钥、私密路径、客户隐私或图片二进制。"
    },
    promotion: {
      sync_to_git_candidate: false,
      promoted_to_git: false,
      git_target_file: null,
      promotion_reason_cn: null
    },
    final_decision: {
      should_write_to_vcp: false,
      static_draft_only: true,
      memory_write_performed: false,
      write_request_draft_status: memoryApproval.status === "approved" ? "approved_in_static_draft_pending_external_runtime_gate" : "not_ready_for_external_runtime_gate",
      should_show_in_review_console: true,
      rejection_reason_cn: memoryApproval.rejection_reason_cn
    }
  };
}

function unifiedCapsuleContractReportState() {
  return state.unified_capsule_contract_report;
}

function renderUnifiedCapsuleContractReport() {
  const report = unifiedCapsuleContractReportState();
  const summary = qs("#unifiedCapsuleContractSummary");
  const rows = qs("#unifiedCapsuleContractRows");
  const guard = qs("#unifiedCapsuleContractGuard");
  if (!summary || !rows || !guard || !report) return;
  summary.innerHTML = [
    ["overall", report.contract_status.overall_passed ? "passed" : "failed"],
    ["registry", report.contract_status.registry_passed ? "passed" : "failed"],
    ["manifest", report.contract_status.manifest_passed ? "passed" : "failed"],
    ["relation", report.contract_status.relation_passed ? "passed" : "failed"],
    ["guard", report.contract_status.guard_passed ? "passed" : "failed"],
    ["total", String(report.totals.total)]
  ].map(([label, value]) => `<span><strong>${label}</strong>${value}</span>`).join("");
  rows.innerHTML = report.samples.map((sample) => `
    <article class="registry-report-v2-card">
      <strong>${sample.sample_id}</strong>
      <p>${sample.lane} | manifest: ${sample.manifest_validation_status} | relation: ${sample.relation_validation_status} | guard: ${sample.guard_validation_status}</p>
      <p>${sample.reviewer_action || sample.reviewer_action_cn}</p>
    </article>
  `).join("");
  guard.innerHTML = Object.entries(report.guard)
    .map(([key, value]) => `<span>${key}: ${value}</span>`)
    .join("");
}
function renderDraft() {
  const memoryApproval = approvalPayload();
  const humanTotal = totalFrom(state.humanScores);
  const realRenderActive = assetArchiveRealPreviewRenderActivation.enabled;
  const decisionTarget = currentReviewTarget();
  const previewBoundaryState = previewRenderBoundaryState();
  const previewOriginalState = previewOriginalRenderState();
  const draft = {
    adapter_dry_run_handoff: state.adapter_dry_run_handoff,
    review_result_protocol_static_handoff: state.review_result_protocol_static_handoff,
    review_decision_package_static_handoff: state.review_decision_package_static_handoff,
    review_evidence_blocker_contract_static_handoff: state.review_evidence_blocker_contract_static_handoff,
    review_blocker_arbiter_static_handoff: state.review_blocker_arbiter_static_handoff,
    review_report_static_handoff: state.review_report_static_handoff,
    review_report_negative_guard_static_handoff: state.review_report_negative_guard_static_handoff,
    review_evidence_blocker_adapter_negative_static_handoff: state.review_evidence_blocker_adapter_negative_static_handoff,
    full_asset_archive_baseline_state: fullAssetArchiveBaselineState(),
    controlled_visual_production_loop_contract: controlledVisualProductionLoopContractState(),
    controlled_visual_production_loop_review_bridge_state: controlledVisualProductionLoopReviewBridgeState(),
    multi_capsule_dashboard_state: multiCapsuleDashboardState(),
    registry_report_v2_state: registryReportV2State(),
    registry_report_v2_negative_visibility_state: registryReportV2NegativeVisibilityState(),
    unified_capsule_contract_report: unifiedCapsuleContractReportState(),
    failure_state_static_workbench_state: failureStateStaticWorkbenchState(),
    artifact_recoverability_dashboard_evidence: state.artifact_dashboard_evidence,
    portable_preview_capsule_evidence: state.portable_preview_capsule_evidence,
    portable_preview_capsule_evidence_list: state.portable_preview_capsule_evidence_list,
    portable_failure_capsule_evidence: state.portable_failure_capsule_evidence,
    portable_failure_capsule_evidence_list: state.portable_failure_capsule_evidence_list,
    artifact_lifecycle_state_reader: normalizeArtifactLifecycleState(),
    artifact_lifecycle_filter_state: {
      selected_filter: state.lifecycleFilter,
      allowed_filters: ["all", "recoverable", "blocked"],
      search_query: state.lifecycleSearch,
      visible_count: artifactEvidenceFilterRecords(normalizeArtifactLifecycleState().records, state.lifecycleFilter, state.lifecycleSearch).length,
      selected_artifact_id: state.selectedArtifactId,
      selected_artifact_hidden_by_current_filter: artifactEvidenceStatusSortFilterInteractionState().selected_artifact_hidden_by_current_filter,
      filter_is_local_ui_only: true,
      search_is_local_ui_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      vcp_runtime_integration_proven: false
    },
    artifact_evidence_status_sort_state: artifactEvidenceStatusSortState(),
    artifact_evidence_status_sort_filter_interaction_state: artifactEvidenceStatusSortFilterInteractionState(),
    artifact_prompt_completion_state: {
      records: normalizeArtifactLifecycleState().records.map((record) => ({
        sample_id: record.sample_id,
        candidate_id: record.candidate_id,
        visual_task: record.visual_task,
        prompt_package_ref: record.prompt_package_ref,
        artifact_ref: record.artifact_ref,
        prompt_to_artifact_completion: record.prompt_to_artifact_completion
      })),
      static_panel_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      vcp_runtime_integration_proven: false
    },
    artifact_detail_drawer_state: {
      selected_artifact_id: state.selectedArtifactId,
      selected_artifact: currentArtifactDetail(),
      static_detail_only: true,
      fetch_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      vcp_runtime_integration_proven: false
    },
    artifact_evidence_compare_state: artifactEvidenceCompareState(),
    artifact_evidence_review_notes_state: artifactEvidenceReviewNotesState(),
    three_sample_gap_summary_state: threeSampleGapSummaryState(),
    recoverability_matrix_state: recoverabilityMatrixState(),
    review_console_schema_binding_coverage_state: reviewConsoleSchemaBindingCoverageState(),
    six_month_goal_gap_state: sixMonthGoalGapState(),
    third_sample_acceptance_readiness_state: thirdSampleAcceptanceReadinessState(),
    third_sample_post_approval_gate_state: thirdSamplePostApprovalGateState(),
    human_approval_blocker_queue_state: humanApprovalBlockerQueueState(),
    exact_new_trial_003_formal_human_approval_capture_surface_state: exactNewTrial003FormalHumanApprovalCaptureSurfaceState(),
    third_sample_accepted_samples_authorization_package_state: thirdSampleAcceptedSamplesAuthorizationPackageState(),
    review_console_runtime_gap_dashboard_state: reviewConsoleRuntimeGapDashboardState(),
    visual_eval_readonly_review_corpus_renderer_static_handoff: readonlyReviewCorpusRendererState(),
    readonly_visual_review_mvp_state: readonlyVisualReviewMvpState(),
    readonly_visual_review_dataset_regression_state: readonlyVisualReviewDatasetRegressionState(),
    codex_session_import_record_reader: state.import_record_reader,
    preview_display_state: previewDisplayProxyState(),
    preview_render_boundary_state: previewBoundaryState,
    preview_original_render_state: previewOriginalState,
    evidence_progressive_disclosure_state: evidenceFocusState(),
    current_decision_state: {
      sample_id: decisionTarget.sample_id,
      preview_id: decisionTarget.preview_id,
      sample_number: decisionTarget.sample_number,
      review_session_current_version_id: decisionTarget.review_session_current_version_id,
      source_asset_ref: decisionTarget.source_asset_ref,
      output_asset_ref: decisionTarget.output_asset_ref,
      source_preview_ref: decisionTarget.source_preview_ref,
      source_original_ref: decisionTarget.source_original_ref,
      render_mode: decisionTarget.render_mode,
      decision_target_source: decisionTarget.decision_target_source,
      asset_status: state.assetStatus,
      asset_status_cn: archiveStatusLabel(state.assetStatus),
      archive_action: state.approval.archive_action,
      memory_status: state.memoryStatus,
      memory_status_cn: memoryStatusLabel(state.memoryStatus),
      memory_action: state.approval.memory_action,
      last_decision_event: decisionEventWithTarget(state.lastDecisionEvent, decisionTarget),
      next_reviewer_action_cn: nextReviewerActionLabel(),
      production_write_now: false,
      DailyNote_write_now: false,
      VCP_memory_write_now: false,
      sticky_reviewer_summary_rendered: true,
      evidence_progressive_disclosure_rendered: true,
      action_feedback_rendered: true
    },
    review_session: buildReviewSession(memoryApproval, humanTotal),
    image_case: buildImageCase(humanTotal),
    memory_delta: buildMemoryDelta(memoryApproval),
    prototype_guard: {
      api_called: false,
      daily_note_called: false,
      vcp_plugin_called: false,
      disk_write_performed: false,
      image_file_created: false,
      asset_archive_read_performed: realRenderActive,
      asset_archive_ui_read_performed: realRenderActive,
      preview_loaded_or_rendered: realRenderActive,
      browser_preview_load_performed: realRenderActive,
      preview_display_static_proxy_rendered: !realRenderActive,
      exact_asset_archive_preview_refs_only: realRenderActive
    }
  };
  qs("#draftOutput").value = JSON.stringify(draft, null, 2);
}

function renderAll() {
  qs("#sessionId").textContent = state.session_id;
  qs("#sessionStatus").textContent = sessionStatusLabel(state.status);
  renderVersions();
  renderScores();
  renderComments();
  renderReviewerStickySummary();
  renderDecisionStatus();
  renderIteration();
  renderProtocolHandoff();
  renderDecisionPackageHandoff();
  renderEvidenceBlockerHandoff();
  renderReviewBlockerArbiterHandoff();
  renderReviewReportHandoff();
  renderNegativeReviewReportHandoff();
  renderAdapterNegativeHandoff();
  renderFailureStateStaticWorkbench();
  renderArtifactEvidenceDashboard();
  renderFullAssetArchiveBaseline();
  renderControlledVisualProductionLoopContract();
  renderControlledVisualProductionLoopReviewBridge();
  renderMultiCapsuleDashboard();
  renderRegistryReportV2State();
  renderUnifiedCapsuleContractReport();
  renderRegistryReportV2NegativeVisibility();
  renderArtifactLifecycleStateReader();
  renderArtifactPromptCompletionPanel();
  renderArtifactDetailDrawer();
  renderArtifactEvidenceCompare();
  renderArtifactEvidenceReviewNotes();
  renderThreeSampleGapSummary();
  renderRecoverabilityMatrix();
  renderReviewConsoleSchemaBindingCoverage();
  renderSixMonthGoalGap();
  renderThirdSampleAcceptanceReadiness();
  renderThirdSamplePostApprovalGate();
  renderHumanApprovalBlockerQueue();
  renderExactNewTrial003FormalHumanApprovalCaptureSurface();
  renderThirdSampleAcceptedSamplesAuthorizationPackage();
  renderReviewConsoleRuntimeGapDashboard();
  renderEvidenceFocus();
  renderReviewSpineV11();
  renderReadonlyReviewCorpusRenderer();
  renderReadonlyVisualReviewMvp();
  renderReadonlyVisualReviewDatasetRegression();
  loadImportRecordSeed();
  renderDraft();
}

qs("#addCommentBtn").addEventListener("click", addComment);
qs("#refreshDraftBtn").addEventListener("click", renderDraft);
qs("#loadImportSeedBtn").addEventListener("click", loadImportRecordSeed);
qs("#parseImportRecordBtn").addEventListener("click", () => parseImportRecordText("manual_text_input"));
qs("#importRecordFile").addEventListener("change", handleImportRecordFile);
qsa("[data-archive]").forEach((button) => {
  button.addEventListener("click", () => setArchiveStatus(button.dataset.archive));
});
qsa("[data-memory]").forEach((button) => {
  button.addEventListener("click", () => setMemoryStatus(button.dataset.memory));
});
qsa("[data-evidence-mode]").forEach((button) => {
  button.addEventListener("click", () => setEvidenceMode(button.dataset.evidenceMode));
});
qsa("[data-spine-sample-prev]").forEach((button) => {
  button.addEventListener("click", () => setCurrentReviewSampleByOffset(-1));
});
qsa("[data-spine-sample-next]").forEach((button) => {
  button.addEventListener("click", () => setCurrentReviewSampleByOffset(1));
});
qsa("[data-stage-zoom-out]").forEach((button) => {
  button.addEventListener("click", () => bumpPreviewStageZoom(-1));
});
qsa("[data-stage-zoom-in]").forEach((button) => {
  button.addEventListener("click", () => bumpPreviewStageZoom(1));
});
qsa("[data-stage-zoom-reset]").forEach((button) => {
  button.addEventListener("click", () => setPreviewStageZoom(stageZoomRange.reset));
});
qsa("[data-sample-drawer-toggle]").forEach((button) => {
  button.addEventListener("click", () => setSampleDrawerOpen(!state.sampleDrawerOpen));
});
qs("#spineSampleRail").addEventListener("click", (event) => {
  const sampleButton = event.target.closest("[data-spine-version-id]");
  if (!sampleButton) return;
  const versionId = sampleButton.dataset.spineVersionId;
  const previewId = sampleButton.dataset.previewId;
  const skinId = sampleButton.dataset.previewSkinId;
  setReviewSampleFromDataset(versionId, previewId, skinId);
});
qs("#spineDecisionSpine").addEventListener("click", (event) => {
  const blockerButton = event.target.closest("[data-spine-blocker-id]");
  if (blockerButton) {
    setSelectedSpineBlocker(blockerButton.dataset.spineBlockerId);
    return;
  }
  const riskButton = event.target.closest("[data-risk-action]");
  if (riskButton) {
    handleRiskAction(riskButton.dataset.riskAction);
    return;
  }
  const evidenceButton = event.target.closest("[data-evidence-mode]");
  if (evidenceButton) {
    setEvidenceMode(evidenceButton.dataset.evidenceMode);
  }
});
qs("#spineTriageBar").addEventListener("click", (event) => {
  const evidenceButton = event.target.closest("[data-evidence-mode]");
  if (evidenceButton) {
    setEvidenceMode(evidenceButton.dataset.evidenceMode);
  }
});
qs("#spineWorkbenchSummary").addEventListener("click", (event) => {
  const evidenceButton = event.target.closest("[data-evidence-mode]");
  if (evidenceButton) {
    setEvidenceMode(evidenceButton.dataset.evidenceMode);
  }
});
qs("#spineEvidenceRows").addEventListener("click", (event) => {
  const row = event.target.closest("[data-spine-blocker-id]");
  if (row) setSelectedSpineBlocker(row.dataset.spineBlockerId);
});
qs("#spineActionSheet").addEventListener("click", (event) => {
  if (event.target.closest("[data-action-sheet-close]")) {
    setHighRiskSheetOpen(false);
    return;
  }
  if (event.target.closest("[data-confirm-high-risk]")) {
    const confirmed = qs("#spineActionConfirmCheck").checked;
    if (!confirmed) return;
    setArchiveStatus("rejected");
    setHighRiskSheetOpen(false);
  }
});
qs("#evidenceFocusBody").addEventListener("click", (event) => {
  const severityButton = event.target.closest("[data-blocker-severity-filter]");
  if (severityButton) {
    setActiveBlockerFilter("severity", severityButton.dataset.blockerSeverityFilter);
    return;
  }
  const sourceButton = event.target.closest("[data-blocker-source-filter]");
  if (sourceButton) {
    setActiveBlockerFilter("source", sourceButton.dataset.blockerSourceFilter);
    return;
  }
  const anchorButton = event.target.closest("[data-full-evidence-anchor]");
  if (anchorButton) {
    focusFullEvidenceAnchor(anchorButton.dataset.fullEvidenceAnchor);
  }
});
qsa("[data-lifecycle-filter]").forEach((button) => {
  button.addEventListener("click", () => setLifecycleFilter(button.dataset.lifecycleFilter));
});
qs("#artifactLifecycleSearch").addEventListener("input", (event) => setLifecycleSearch(event.target.value));
qs("#memoryTitle").addEventListener("input", renderDraft);
qs("#memoryContent").addEventListener("input", renderDraft);

renderAll();
