# Phase H Review Console Runtime Product Hardening

把 runtime prototype 从"可验证"推进到"可长期用"。本阶段只做文档、fixture 和 validator 强化，不修改真实 VCPChat，不调用插件/API/DailyNote，不写 VCP memory，不创建图片。

```yaml
phase_h:
  status: completed
  timestamp: "2026-05-08"
  phase: "Phase H — Review Console Runtime Product Hardening"
  real_execution: false
  plugin_called: false
  image_created: false
  daily_note_called: false
  vcp_memory_written: false
```

## 1. 16 Draft Surface Field Integrity Audit

### 1.1 review_session_draft

构建点: `buildDraft()` (line 3258)
来源: `buildReviewSessionDraft()` 从 UI form + mock session 组合

```yaml
required_fields:
  session_id: string
  task_id: string
  case_id: string
  project: string
  status: "human_reviewing | approved | rejected"
  image_versions: list
  current_version_id: string
  compare_version_id: string | null
  ai_review: map (score, summary, archive_recommendation, tags)
  human_review: map (score, summary_cn, reviewer)
  final_review: map (source=human_review|ai_review, score, summary)
  approval: map (approved, approved_by, approved_at)
  archive_decision: map (asset_status, reason_cn)
  memory_preview: map (chinese_diary_title, chinese_diary_content, target_notebook, tags, safety)
  memory_approval: map (status, approved_by, approved_at)
  audit_log: list
  review_preflight: map (prototype_guard_clean, guardClean, etc.)
optional_fields:
  - comments
  - annotation_notes
  - version_comparison
  - next_iteration
```

### 1.2 image_case_draft

构建点: `buildDraft()` (line 3344)
来源: UI form selections + mock seed

```yaml
required_fields:
  case_id: string
  task_id: string
  project: string
  image_type: string ("Photo Studio OS")
  input_assets: list
  output_assets: list
  plugin_used: string | null
  prompt_package_id: string
  final_score: number
  asset_status: "candidate | accepted | rejected | needs_human_review"
  human_approval: map (approved, approved_by, approved_at)
  strengths_cn: string
  weaknesses_cn: string
  reusable_rules_cn: string
  memory_entries: list
```

### 1.3 memory_delta_draft

构建点: `buildDraft()` (line 3363)
来源: UI memory form + approval select

```yaml
required_fields:
  delta_id: string
  task_id: string
  case_id: string
  project: string
  created_at: string (ISO)
  agent_name: string
  agent_role: string
  memory_type: string
  target_notebook: string
  write_mode: "draft | confirmed | forbidden"
  approval_status: "pending | approved | rejected"
  approved_by: string | null
  approved_at: string | null
  source: map (session_id, task_id, case_id)
  chinese_diary_title: string
  chinese_diary_content: string
  preserved_original: null
  tags: list
  visibility: "audit"
  memory_safety: map (contains_secret, contains_private_path, contains_customer_private_data, contains_image_binary)
  promotion: false
  final_decision: map (should_write_to_vcp, reason_cn)
```

### 1.4 memory_completion_state_draft

构建点: `buildMemoryCompletionState()` (line 569)

```yaml
required_fields:
  write_requested: boolean
  write_authorized: boolean
  write_performed: boolean
  canonical_location_verified: boolean
  canonical_hash_matched: boolean
  plugin_success_sufficient: boolean
  boundary_cn: string
```

### 1.5 accepted_candidate_delivery_package_draft

构建点: `buildAcceptedCandidateDeliveryPackageDraft()` (line 1729)

```yaml
required_fields:
  package_id: string
  package_status: "draft_only"
  created_at: string
  selected_asset_ref: string
  sanitized_asset_hash: string
  review_score: number
  review_verdict: string
  risk_summary_cn: string
  human_approval_summary_cn: string
  memory_delta_preview: map
  reusable_rules_summary_cn: string
  submitDraft_called: false
  delivery_readiness: map
  no_execution_guard: map (5 flags all false)
```

### 1.6 human_override_traceability_draft

构建点: `buildHumanOverrideTraceabilityDraft()` (line 1654)
来源: `buildHumanOverrideTraceabilityMatrix()` (line 1583)

```yaml
required_fields:
  traceability_id: string
  traceability_matrix_status: string
  package_status: "draft_only"
  created_at: string
  queue_id: string
  human_decision_source: string
  human_decision_source_cn: string
  override_reason_cn: string
  known_deviation_summary_cn: string
  prompt_compliance_summary_cn: string
  memory_suitability_summary_cn: string
  traceability_items: list
  traceability_counts: map (total, accepted, accepted_candidate, human_override, rejected, needs_human_review, prompt_complete, memory_suitable)
  traceability_summary_cn: string
  traceability_boundary_cn: string
  no_execution_guard: map
```

### 1.7 inactive_authorization_capsules_draft

构建点: `buildInactiveAuthorizationCapsulesDraft()` (line 1422)

```yaml
required_fields:
  authorization_status: "inactive_package"
  created_at: string
  capsules: list (5 capsules)
  capsules[*]:
    capsule_id: string
    target_action: string
    authorization_status: "inactive_package"
    reason_inactive_cn: string
    activation_requires_cn: string
  activation_required: true
  no_execution_guard: map
```

### 1.8 runtime_review_state_draft

构建点: `buildRuntimeReviewStateDraft()` (line 1844)

```yaml
required_fields:
  state_id: string
  created_at: string
  convergence_status: "converged | diverged"
  convergence_status_cn: string
  normalized_state:
    asset_state_key: string
    asset_state_cn: string
    review_status_cn: string
    memory_status_key: string
    memory_status_cn: string
    delivery_status_key: string
    override_status_key: string
  queue_state_counts: map
  mismatch_details: list
  no_execution_guard: map
```

### 1.9 local_commit_scope_plan_draft

构建点: `buildLocalCommitScopePlanDraft()` (line 1923)

```yaml
required_fields:
  plan_id: string
  plan_status: "local_commit_scope_candidate"
  created_at: string
  scope_groups: list (4 groups: runtime, validators, docs, agent-board)
  staged_changes_present: false
  commit_allowed: false
  push_allowed: false
  tag_allowed: false
  runtime_state_ref: map
  no_execution_guard: map
```

### 1.10 bridge_mock_roundtrip_candidate_draft

构建点: `buildBridgeMockRoundtripCandidateDraft()` (line 2053)

```yaml
required_fields:
  roundtrip_id: string
  roundtrip_status: "mock_roundtrip_candidate"
  created_at: string
  bridge_mode: "project_local_mock"
  source: "review_console_runtime_draft"
  source_fixture_policy: "project_local_fixtures_only"
  selected_methods: ["loadSession", "previewDraft"]
  bridge_calls_observed: map (loadSession=1, previewDraft=1, submitDraft=0)
  ack_summaries: list
  mock_only: true
  submitDraft_called: false
  no_execution_guard: map
```

### 1.11 real_bridge_authorization_package_draft

构建点: `buildRealBridgeAuthorizationPackageDraft()` (line 2146)

```yaml
required_fields:
  package_id: string
  authorization_status: "inactive_package"
  created_at: string
  allowed_methods: ["cancel", "loadSession", "previewDraft"]
  submitDraft_forbidden: true
  real_cdp_called: false
  production_bridge_invocation_performed: false
  source_read_performed: false
  no_execution_guard: map
```

### 1.12 plugin_reliability_prompt_discipline_draft

构建点: `buildPluginReliabilityPromptDisciplineDraft()` (line 2210)

```yaml
required_fields:
  discipline_id: string
  reliability_status: "local_prompt_reliability_candidate"
  created_at: string
  selected_plugin_id: "DoubaoGen"
  requested_model: string
  prompt_hash: string
  prompt_registry_status: "local_registry_candidate"
  max_plugin_calls_allowed: 0
  lint_rules_count: number
  failure_taxonomy: list (4 items)
  provider_capture_inactive: true
  no_execution_guard: map
```

### 1.13 memory_write_completion_candidate_draft

构建点: `buildMemoryWriteCompletionCandidateDraft()` (line 2276)

```yaml
required_fields:
  candidate_id: string
  candidate_status: "memory_write_completion_preflight_candidate"
  created_at: string
  plugin_success_sufficient: false
  writer_executed: false
  canonical_target_exists: false
  canonical_hash_matched: false
  write_complete_declared: false
  observed_state: map
  no_execution_guard: map
```

### 1.14 single_real_generation_retry_gate_draft

构建点: `buildSingleRealGenerationRetryGateDraft()` (line 2333)

```yaml
required_fields:
  gate_id: string
  gate_status: "single_real_generation_retry_gate_inactive"
  created_at: string
  selected_plugin_id: "DoubaoGen"
  selected_plugin_command: "generate"
  requested_model: string
  max_plugin_calls_per_run: 1
  plugin_calls_observed: 0
  real_generation_performed: false
  image_created: false
  memory_write_allowed_by_this_record: false
  authorization_status: "inactive_package"
  no_execution_guard: map
```

### 1.15 real_memory_write_authorization_package_draft

构建点: `buildRealMemoryWriteAuthorizationPackageDraft()` (line 2422)

```yaml
required_fields:
  package_id: string
  authorization_status: "inactive_package"
  created_at: string
  max_daily_note_writes: 1
  max_vcp_memory_writes: 1
  max_retry_attempts: 1
  content_language_rule: "chinese_desanitized_summary_only"
  no_raw_path_endpoint_secret: true
  no_success_fabrication_rule: true
  daily_note_called: false
  vcp_memory_written: false
  write_complete_declared: false
  no_execution_guard: map
```

### 1.16 asset_archive_candidate_draft

构建点: `buildAssetArchiveCandidateDraft()` (line 2499)

```yaml
required_fields:
  archive_id: string
  archive_status: "asset_archive_candidate_no_binary"
  created_at: string
  archive_policy: "metadata_only_no_binary"
  asset_classification: string
  binary_storage_allowed: false
  git_binary_stored: false
  memory_binary_stored: false
  closeout_templates: list (3: accepted_candidate, needs_human_review, rejected)
  output_path_ref: string
  asset_hash: string
  review_score: number
  review_summary_cn: string
  reusable_rules_cn: string
  human_override_reason_cn: string
  no_execution_guard: map
```

## 2. State Matrix

| Draft Surface | Empty State | Error State | Read-Only | Approved | Notes |
| --- | --- | --- | --- | --- | --- |
| review_session_draft | initial load (candidate) | dirty guard rejection | reviewing | status=approved, human_approved=true | 人工批准 required for approved |
| image_case_draft | asset_status=candidate | N/A | readonly when committed | asset_status=accepted | 未批准时不 accepted |
| memory_delta_draft | write_mode=draft | dirty guard rejection | draft only | write_mode=confirmed | should_write_to_vcp depends approval |
| memory_completion_state | all false | N/A | all false (no-write) | write_performed=true only after real write | prototype: always false |
| accepted_candidate_delivery | package_status=draft_only | submit rejected | draft_only | delivery_readiness.accepted | submitDraft_called=false |
| human_override_traceability | empty traceability_items | N/A | draft_only | 当人工批准后记录 | traceability_matrix generated per queue |
| inactive_authorization_capsules | all 5 capsules inactive | dirty guard rejection | inactive_package | N/A (never active in prototype) | activation requires A5 |
| runtime_review_state | initial convergence | mismatch detection | converged/diverged | 状态收敛后稳定 | 资产/记忆/交付/覆盖 独立追踪 |
| local_commit_scope_plan | 4 groups, all unstaged | staged found (blocked) | candidate | commit_allowed only when authorized | 永远不自动 commit |
| bridge_mock_roundtrip | loadSession=1, previewDraft=1 | dirty guard rejection | mock only | N/A (always mock) | submitDraft=0 |
| real_bridge_auth_package | inactive_package | dirty guard rejection | inactive | N/A (needs A5) | submitDraft forbidden |
| plugin_reliability_prompt | local_registry_candidate | dirty guard rejection | candidate | N/A (local only) | max_calls=0 |
| memory_write_completion | all checks false | dirty guard rejection | preflight candidate | N/A (no real write) | plugin_success≠complete |
| single_gen_retry_gate | inactive_package | dirty guard rejection | gate inactive | N/A (needs A5) | plugin_calls=0 |
| real_memory_write_auth | inactive_package | dirty guard rejection | inactive | N/A (needs A5) | no_success_fabrication |
| asset_archive_candidate | metadata only | N/A | no binary | 3 closeout templates ready | binary_storage=false |

## 3. Session Import/Export Compat Rules

基于 Batch 9B compatibility matrix:

```yaml
compat_rules:
  export_format: "runtime_review_session_v1"
  import_rules:
    - "legacy_minimal v1 packages accepted when draft-rich blocks absent"
    - "current_draft_rich v1 packages require clean no_execution_guard for all 16 surfaces"
    - "stale or mismatched session_fingerprint → reject"
    - "dirty prototype_guard → reject"
    - "missing review_queue → reject"
    - "future format without migration plan → reject"
  fixtures:
    legacy: "tests/schema_examples/runtime_review_session_v1_legacy_minimal.example.json"
    current: "tests/schema_examples/runtime_review_session_v1_current_draft_rich.example.json"
```

## 4. Runtime Hardening Rules

```yaml
hardening_rules:
  human_override_ai:
    rule: "human_review MUST override ai_review"
    check: "final_review.source === 'human_review' when human_review.score !== ai_review.score"
    verified_in: "smoke test preflight_checks"

  memory_no_direct_write:
    rule: "memory_approval.status !== 'approved' → write_mode=draft, should_write_to_vcp=false"
    check: "memory_delta_draft.final_decision.should_write_to_vcp === false when memory_approval.status !== 'approved'"
    verified_in: "smoke test rejection_checks"

  asset_no_auto_accept:
    rule: "asset_status !== 'accepted' when human_approved === false"
    check: "image_case_draft.asset_status === 'accepted' implies human_approval.approved === true"
    verified_in: "smoke test preflight_checks"

  deliver_no_submit:
    rule: "submitDraft must be called=false in prototype"
    check: "accepted_candidate_delivery_package_draft.submitDraft_called === false"
    verified_in: "smoke test rejection_checks"

  capsule_all_inactive:
    rule: "all authorization capsules must be inactive_package"
    check: "every capsule in inactive_authorization_capsules_draft has authorization_status='inactive_package'"
    verified_in: "smoke test rejection_checks"

  state_no_mismatch:
    rule: "runtime_review_state must be converged when asset/memory/delivery agree"
    check: "mismatch_count === 0 → convergence_status === 'converged'"
    verified_in: "smoke test runtime_review_state"

  guard_all_clean:
    rule: "all 5 prototype_guard flags must be false"
    check: "api_called=false, daily_note_called=false, vcp_plugin_called=false, disk_write_performed=false, image_file_created=false"
    verified_in: "runtime_guard.js + smoke test"
```

## 5. Validation

```powershell
node --check review_console\runtime_prototype\app.js
node --check review_console\runtime_prototype\runtime_guard.js
node --check review_console\runtime_prototype\host_bridge_mock.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
git diff --check
```

## 6. Acceptance

```yaml
phase_h_acceptance:
  all_16_surfaces_audited: true
  required_fields_documented: true
  state_matrix_complete: true
  export_import_compat_defined: true
  hardening_rules_documented: true
  smoke_test_covers_all_rules: true
  no_real_execution: true
  no_vcpchat_modified: true
```
