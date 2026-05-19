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
  portable_failure_capsule_evidence: mock.portable_failure_capsule_evidence,
  portable_failure_capsule_evidence_list: mock.portable_failure_capsule_evidence_list,
  artifact_lifecycle_state_reader: mock.artifact_lifecycle_state_reader_seed,
  third_sample_authorization_package: mock.third_sample_accepted_samples_authorization_package_seed,
  third_sample_post_approval_gate: mock.third_sample_post_approval_gate_seed,
  human_approval_blocker_queue: mock.human_approval_blocker_queue_seed,
  runtime_gap_dashboard: mock.review_console_runtime_gap_dashboard_contract_seed,
  lifecycleFilter: "all",
  selectedArtifactId: mock.artifact_lifecycle_state_reader_seed.records[0].sample_id,
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
  humanScores: { ...mock.review_session.human_review.breakdown }
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
  const acceptedReportRows = acceptedCapsules.map((capsule) => ({
    lane: "accepted",
    sample_id: capsule.sample_id,
    status: capsule.validation_status,
    registry_validator_status: capsule.registry_validator_status,
    clone_portable_validation_status: capsule.clone_portable_validation_status,
    preview_ref: capsule.preview_ref,
    manifest_ref: capsule.manifest_ref,
    chain_refs: [capsule.import_record_ref, capsule.review_record_ref, capsule.approval_record_ref],
    passed: capsule.clone_portable_validation_status === "passed" && capsule.registry_validator_status === "registry_driven_preview_capsules_verified"
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

function artifactEvidenceFilterRecords(records, filter) {
  return records.filter((record) => {
    if (filter === "recoverable") return record.recoverable === true;
    if (filter === "blocked") return record.blocked_registration === true;
    return true;
  });
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
  const filterResults = ["all", "recoverable", "blocked"].map((filter) => {
    const visible = artifactEvidenceFilterRecords(lifecycle.records, filter).slice().sort((left, right) => {
      const leftId = left.sample_id || left.candidate_id;
      const rightId = right.sample_id || right.candidate_id;
      return (sortedIdOrder.get(leftId) ?? 99) - (sortedIdOrder.get(rightId) ?? 99);
    });
    return {
      filter,
      visible_artifact_ids: visible.map((record) => record.sample_id || record.candidate_id),
      visible_count: visible.length,
      first_visible_artifact_id: visible[0] ? (visible[0].sample_id || visible[0].candidate_id) : null
    };
  });
  return {
    draft_output_key: "artifact_evidence_status_sort_filter_interaction_state",
    source_sort_key: "artifact_evidence_status_sort_state",
    sort_mode: sortState.sort_mode,
    filter_results: filterResults,
    all_filter_blocked_candidate_first: filterResults.find((item) => item.filter === "all")?.first_visible_artifact_id === sortState.blocked_candidate_artifact_id,
    recoverable_filter_excludes_blocked_candidate: !filterResults.find((item) => item.filter === "recoverable")?.visible_artifact_ids.includes(sortState.blocked_candidate_artifact_id),
    blocked_filter_only_blocked_candidate: JSON.stringify(filterResults.find((item) => item.filter === "blocked")?.visible_artifact_ids || []) === JSON.stringify([sortState.blocked_candidate_artifact_id]),
    current_lifecycle_filter: state.lifecycleFilter,
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
  const visibleRecords = artifactEvidenceFilterRecords(lifecycle.records, state.lifecycleFilter).slice().sort((left, right) => {
    const leftId = left.sample_id || left.candidate_id;
    const rightId = right.sample_id || right.candidate_id;
    return (sortedIdOrder.get(leftId) ?? 99) - (sortedIdOrder.get(rightId) ?? 99);
  });
  qsa("[data-lifecycle-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lifecycleFilter === state.lifecycleFilter);
  });
  qs("#artifactLifecycleSummary").innerHTML = `
    <span>parsed <strong>${escapeHtml(lifecycle.parse_status)}</strong></span>
    <span>recoverable <strong>${escapeHtml(counts.recoverable_accepted_sample_count)}</strong></span>
    <span>blocked <strong>${escapeHtml(counts.blocked_registration_candidate_count)}</strong></span>
    <span>gap <strong>${escapeHtml(counts.remaining_full_recoverable_sample_gap)}</strong></span>
    <span>3-sample met <strong>${escapeHtml(counts.hard_acceptance_three_full_samples_met)}</strong></span>
    <span>sort <strong>${escapeHtml(statusSort.sort_mode)}</strong></span>
    <span>filter <strong>${escapeHtml(state.lifecycleFilter)}</strong></span>
  `;

  const root = qs("#artifactLifecycleList");
  root.innerHTML = "";
  visibleRecords.forEach((record) => {
    const card = document.createElement("article");
    card.className = `artifact-lifecycle-card ${record.recoverable ? "recoverable" : "blocked"}`;
    card.innerHTML = `
      <div class="protocol-card-head">
        <strong>${escapeHtml(record.sample_id || record.candidate_id)}</strong>
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
    card.addEventListener("click", () => setSelectedArtifact(record.sample_id || record.candidate_id));
    root.appendChild(card);
  });

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
  renderArtifactDetailDrawer();
  renderArtifactEvidenceCompare();
  renderDraft();
}

function setLifecycleFilter(filter) {
  state.lifecycleFilter = ["all", "recoverable", "blocked"].includes(filter) ? filter : "all";
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
      <article class="human-approval-blocker-queue-card blocked">
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

function setArchiveStatus(status) {
  state.assetStatus = status;
  state.approval.archive_action = archiveActionFor(status);
  qsa("[data-archive]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.archive === status);
  });
  renderDraft();
}

function setMemoryStatus(status) {
  state.memoryStatus = status;
  state.approval.memory_action = status === "approved" ? "approve_memory_write" : "request_memory_edit";
  if (status === "rejected") {
    state.approval.memory_action = "reject_memory_write";
  }
  qsa("[data-memory]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.memory === status);
  });
  const lock = qs("#dailyNoteLock");
  if (status === "approved") {
    lock.textContent = "DailyNote request unlocked: 仅生成已审批写入申请，仍不直接调用 DailyNote。";
    lock.classList.add("approved");
  } else {
    lock.textContent = "DailyNote locked: memory_approval.status 不是 approved。";
    lock.classList.remove("approved");
  }
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
  if (memoryApproval.status === "approved") return "confirmed";
  if (memoryApproval.status === "rejected") return "forbidden";
  return "draft";
}

function buildReviewSession(memoryApproval, humanTotal) {
  return {
    session_id: state.session_id,
    task_id: state.task_id,
    case_id: state.case_id,
    project: state.project,
    status: state.status,
    image_versions: state.image_versions,
    current_version_id: state.currentVersionId,
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
      human_approval_required: true,
      ai_archive_recommendation_is_final: false,
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
  return {
    case_id: state.case_id,
    project: state.project,
    task_id: state.task_id,
    image_type: "Photo Studio OS dashboard",
    input_assets: mock.image_case_seed.input_assets,
    output_assets: [currentVersion().asset_ref],
    plugin_used: null,
    prompt_package_id: mock.image_case_seed.prompt_package_id,
    review_ids: mock.image_case_seed.review_ids,
    final_score: humanTotal,
    asset_status: state.assetStatus,
    human_approval: {
      approved: approvedAsset,
      approved_by: approvedAsset ? "human_reviewer" : null,
      approved_at: approvedAsset ? nowIso() : null,
      approval_notes_cn: approvedAsset ? "人工批准后才允许 accepted。" : "未人工批准，不能标记 accepted。"
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
      file_ref: currentVersion().asset_ref
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
      should_write_to_vcp: memoryApproval.status === "approved",
      should_show_in_review_console: true,
      rejection_reason_cn: memoryApproval.rejection_reason_cn
    }
  };
}

function renderDraft() {
  const memoryApproval = approvalPayload();
  const humanTotal = totalFrom(state.humanScores);
  const draft = {
    adapter_dry_run_handoff: state.adapter_dry_run_handoff,
    review_result_protocol_static_handoff: state.review_result_protocol_static_handoff,
    review_decision_package_static_handoff: state.review_decision_package_static_handoff,
    review_evidence_blocker_contract_static_handoff: state.review_evidence_blocker_contract_static_handoff,
    review_blocker_arbiter_static_handoff: state.review_blocker_arbiter_static_handoff,
    review_report_static_handoff: state.review_report_static_handoff,
    review_report_negative_guard_static_handoff: state.review_report_negative_guard_static_handoff,
    review_evidence_blocker_adapter_negative_static_handoff: state.review_evidence_blocker_adapter_negative_static_handoff,
    multi_capsule_dashboard_state: multiCapsuleDashboardState(),
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
      filter_is_local_ui_only: true,
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
    third_sample_accepted_samples_authorization_package_state: thirdSampleAcceptedSamplesAuthorizationPackageState(),
    review_console_runtime_gap_dashboard_state: reviewConsoleRuntimeGapDashboardState(),
    codex_session_import_record_reader: state.import_record_reader,
    review_session: buildReviewSession(memoryApproval, humanTotal),
    image_case: buildImageCase(humanTotal),
    memory_delta: buildMemoryDelta(memoryApproval),
    prototype_guard: {
      api_called: false,
      daily_note_called: false,
      vcp_plugin_called: false,
      disk_write_performed: false,
      image_file_created: false
    }
  };
  qs("#draftOutput").value = JSON.stringify(draft, null, 2);
}

function renderAll() {
  qs("#sessionId").textContent = state.session_id;
  qs("#sessionStatus").textContent = state.status;
  renderVersions();
  renderScores();
  renderComments();
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
  renderMultiCapsuleDashboard();
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
  renderThirdSampleAcceptedSamplesAuthorizationPackage();
  renderReviewConsoleRuntimeGapDashboard();
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
qsa("[data-lifecycle-filter]").forEach((button) => {
  button.addEventListener("click", () => setLifecycleFilter(button.dataset.lifecycleFilter));
});
qs("#memoryTitle").addEventListener("input", renderDraft);
qs("#memoryContent").addEventListener("input", renderDraft);

renderAll();
