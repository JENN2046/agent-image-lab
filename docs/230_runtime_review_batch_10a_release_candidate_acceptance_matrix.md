# Runtime Review Batch 10A Release-Candidate Acceptance Matrix

本文把 Runtime Review vNext acceptance chain 收束成一个可审阅的结构化矩阵，覆盖 bridge、plugin、asset archive、memory lifecycle、runtime prototype、validator suite、operator docs 和 release readiness 八个领域。每行标注完成状态和证据来源，使 release readiness 可在不翻阅数十份历史文档的情况下被评审。

本批只补文档和 validator，不修改真实 VCPChat / VCPToolBox，不调用 bridge / CDP / 插件 / API / DailyNote，不写 VCP memory，不创建图片，也不执行版本动作。

```yaml
runtime_review_batch_10a_release_candidate_acceptance_matrix:
  status: completed_validated_acceptance_matrix
  current_phase: "Runtime Review Batch 10A release-candidate acceptance matrix"
  previous_phase: "Runtime Review Batch 10B end-to-end dry-run replay index"
  doc: docs/230_runtime_review_batch_10a_release_candidate_acceptance_matrix.md
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  bridge_or_cdp_call: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  version_action_performed: false
```

## Acceptance Matrix

| # | Domain | Status | Evidence | Blocked By | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Bridge | `complete` | v10.2 (smoke blocked), v10.3 (strict smoke passed, 3 allowlist calls), v10.1 (resume), no-write imageLabReview surface | `submitDraft` permanently blocked; real bridge in production requires active A5 package | `cancel/loadSession/previewDraft` confirmed working; `submitDraft` rejected probe had no side effects |
| 2 | Plugin — DoubaoGen | `complete` | v10.4–v10.19 (6 generations across multiple attempts), v10.14 (model lock verified), v10.15/v10.18 (UTF-8 no BOM runner transport) | Retry generation requires new explicit authorization | `run_1` accepted_candidate (v10.19); `run_2` needs_human_review; prior attempts all rejected for person/text/logo/prompt mismatch |
| 3 | Plugin — Reliability | `local_only_complete` | plugin_reliability_prompt_discipline_draft (Batch 5A), v10.20 (plugin reported model recording) | Real generation creates images only under explicit authorization | Prompt registry, lint rules, model lock, failure taxonomy all local; `max_plugin_calls_allowed=0` in draft |
| 4 | Asset Archive | `local_only_complete` | asset_archive_candidate_draft (Batch 7A), v10.21 (asset selection review) | Real binary storage requires authorization | Metadata-only templates for accepted_candidate/needs_human_review/rejected; `binary_storage_allowed=false` |
| 5 | Memory Lifecycle — Draft | `complete` | v10.22 (memory_delta draft), v10.23 (human review package), v10.24 (no-write preflight) | N/A (draft-only, no real write) | Complete draft pipeline from selection through human review approval |
| 6 | Memory Lifecycle — Write | `complete` | v10.25 (real DailyNoteWrite), v10.26 (closeout), v10.27 (root path correction), v10.28 (canonical location guard) | Second write requires new explicit authorization | 1 write performed, plugin_status=success, canonical hash verified; `plugin_success_sufficient=false` guard active |
| 7 | Memory — Completion Guard | `local_only_complete` | memory_write_completion_candidate_draft (Batch 6A), memory_completion_state_draft (Batch 2B) | Real write completion check requires real write first | `writer_executed=false`, `canonical_target_exists=false` in local prototype; guard logic verified |
| 8 | Memory — Write Authorization | `local_only_complete` | real_memory_write_authorization_package_draft (Batch 6B) | Activation requires explicit authorization | Inactive package; `max_daily_note_writes=1`, `max_vcp_memory_writes=1`; `no_success_fabrication_rule=true` |
| 9 | Runtime Prototype — Core | `complete` | runtime_guard.js, host_bridge_mock.js, app.js, index.html, styles.css, FIELD_MAPPING.md | N/A (local-only) | Script order verified; guard API accessible; DOM surfaces present; no external fetch/IPC/storage |
| 10 | Runtime Prototype — Draft Surfaces | `complete` | 16 draft surfaces rendered (review_session, image_case, memory_delta, memory_completion_state, accepted_candidate_delivery, human_override_traceability, inactive_authorization_capsules, runtime_review_state, local_commit_scope_plan, bridge_mock_roundtrip, real_bridge_authorization, plugin_reliability_prompt_discipline, memory_write_completion_candidate, single_real_generation_retry_gate, real_memory_write_authorization, asset_archive_candidate) | N/A (draft-only) | All surfaces validated by runtime guard/smoke/delivery surface; `submitDraft_called=false`, `side_effects_performed=false` |
| 11 | Runtime Prototype — Session | `complete` | runtime_review_session_v1 export/import (Batch 9B), legacy_minimal and current_draft_rich fixtures | Future format requires migration plan | Fingerprint validation, dirty guard rejection, import preview all verified |
| 12 | Runtime Prototype — Usability | `complete` | Queue search/sort, undo history, compact cards, status glossary, batch actions, risk tags, preauthorization review (usability batch) | N/A (local-only) | All UI controls validated in smoke test |
| 13 | Validator Suite — Runtime | `complete` | validate_runtime_guard_unit.js, validate_runtime_prototype_smoke.js, validate_runtime_delivery_surface.js, validate_runtime_prototype_suite.js | N/A (local-only) | All passed; suite aggregates 9 checks |
| 14 | Validator Suite — Adapter | `complete` | validate_adapter_delivery_surface.js, validate_review_console_adapter_handoff.js, validate_runtime_review_batch_10b_dry_run_replay_index.js | N/A (local-only) | All passed; 3 fixtures verified |
| 15 | Validator Suite — Batch Validators | `complete` | Batch 9A/9B/9C/10B validators, v10.x A5 validators (v10.0–v10.28), v7.40–v7.46 CDP/debug validators, v5.0–v5.12 delivery validators | N/A (local-only) | All passed; MVP validation routes correctly |
| 16 | Validator Suite — MVP | `complete` | validate_mvp.ps1, validate-agent-image-lab-local.ps1 | N/A (local-only, manual-review warnings only) | Historical v4/v5 validators treated as snapshots; current state via v7.46/agent-board |
| 17 | Operator Docs — Freshness | `complete` | docs/226_runtime_review_batch_9a_state_freshness_index.md | N/A (local-only) | Cross-checked against README, MANIFEST, roadmap, release notes, validation checklist, .agent_board |
| 18 | Operator Docs — Runbook | `complete` | docs/227_runtime_review_batch_9c_operator_runbook_and_resume_capsule.md | N/A (local-only) | Agent resume from runbook in under 5 minutes; no raw secrets/paths/logs |
| 19 | Operator Docs — Compatibility | `complete` | docs/228_runtime_review_batch_9b_runtime_session_compatibility_matrix.md | N/A (local-only) | Legacy and current v1 session formats accepted; future format gated by migration plan |
| 20 | Operator Docs — Replay Index | `complete` | docs/229_runtime_review_batch_10b_end_to_end_dry_run_replay_index.md | N/A (local-only) | Adapter dry-run → Review Console → session export path indexed and validated |
| 21 | Release Readiness — RC Baseline | `complete` | docs/221 (8A RC proposal), docs/222 (8A post-merge checkpoint), docs/223 (8B vNext RC acceptance), docs/224 (8C final acceptance summary) | N/A (local-only) | PR #6 merged at 563ccc4; acceptance chain complete |
| 22 | Release Readiness — Task Plan | `complete` | docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md | N/A (local-only) | Default-auto A4/A4.5 local batches defined; conditional-auto for real/remote/external writes |
| 23 | Release Readiness — Version Actions | `blocked_by_authorization` | v4.9 (tag push-readiness), v5.12 (release candidate readiness), v5.10 (true-loop delivery) | Commit/tag/push/PR/release require concrete active version-action package | All local readiness preflights passed; no version action authorized |
| 24 | A5 Production — Historical | `complete` | v10.0 activation package (preflight blocked), v10.1 resume, v10.2–v10.3 bridge, v10.4–v10.19 DoubaoGen, v10.22–v10.25 memory, v10.26–v10.28 closeout | All prior authorizations consumed | 6 DoubaoGen calls (1 accepted_candidate), 1 DailyNoteWrite, 1 CDP read-only Runtime.evaluate, 0 bridge method invocation |
| 25 | A5 Production — Future | `blocked_by_authorization` | v10.12 (provider-side fingerprint capture, consumed), v10.8 preflight gate (consumed) | New DoubaoGen, DailyNote, VCP memory, image, version action require new active authorization package | v10.25 consumed the single write authorization; v10.19 consumed the 2-call generation authorization |

## Status Summary

```yaml
status_summary:
  complete: 15
  local_only_complete: 5
  blocked_by_authorization: 2
  requires_future_work: 0
  total: 22
  # Row 24 (A5 historical) and row 25 (A5 future) are informational roll-ups of rows 1-8
```

## No-Execution Evidence

所有标记为 `local_only_complete` 或 `complete` 的行都满足以下不变量:

```yaml
no_execution_evidence:
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  bridge_method_invocation: false  # v10.3 strict smoke used allowlist only
  cdp_runtime_evaluate: "read-only surface checks only (v7.46), no method invocation"
  plugin_calls: "historical only; 0 in current local batch"
  api_calls: false
  daily_note_writes: "historical only (v10.25); 0 in current local batch"
  vcp_memory_writes: "historical only (v10.25); 0 in current local batch"
  image_creation: "historical only; 0 in current local batch"
  git_binary_stored: false
  version_actions: false
```

## Blocked By Authorization Detail

```yaml
blocked_items:
  - domain: Version Actions
    status: blocked_by_authorization
    what_is_blocked: "commit, tag, push, PR, GitHub Release"
    what_is_ready: "v4.9 tag push-readiness, v5.10 true-loop delivery, v5.12 RC readiness, local commit scope manifest"
    activation_requires: "concrete active version-action package with passing preflight"

  - domain: A5 Production — Future
    status: blocked_by_authorization
    what_is_blocked: "new DoubaoGen call, new DailyNote write, new VCP memory write, image creation, provider-side echo, sanitized request capture"
    what_is_ready: "runner transport (UTF-8 no BOM byte-write), model lock verified (doubao-seedream-5-0-260128), prompt discipline draft, memory write authorization draft, bridge authorization draft"
    activation_requires: "new explicit user authorization with specific scope, plugin, and call limit"

  - domain: Real Bridge Authorization Package
    status: local_only_complete
    what_is_blocked: "real VCPChat bridge invocation in production mode"
    what_is_ready: "real_bridge_authorization_package_draft (Batch 4B), mock bridge roundtrip verified (Batch 4A), strict allowlist smoke passed (v10.3)"
    activation_requires: "active A5 package with real VCPChat root and explicit bridge method allowlist"

  - domain: Real Memory Write Authorization
    status: local_only_complete
    what_is_blocked: "second DailyNote/VCP memory write"
    what_is_ready: "real_memory_write_authorization_package_draft (Batch 6B), memory write completion candidate (Batch 6A), canonical location guard (v10.28)"
    activation_requires: "new explicit memory write authorization with specific write target and content scope"
```

## Acceptance Criteria

```yaml
acceptance:
  all_domains_covered: true
  each_row_has_status: true
  each_row_has_evidence: true
  blocked_rows_have_blocking_reason: true
  no_execution_evidence_complete: true
  blocked_by_authorization_detail_complete: true
  release_readiness_reviewable: true
  real_execution_gaps_visible: true
  github_release_blocked: true
  no_version_action: true
```

## Validation

```powershell
node --check scripts\validate_local_commit_scope.js
node scripts\validate_local_commit_scope.js
node scripts\validate_runtime_prototype_suite.js
git diff --check
```

人工验收时还应确认:
- 矩阵覆盖所有八个领域
- 每行状态（complete/local_only_complete/blocked_by_authorization）与当前 repo reality 一致
- `blocked_by_authorization` 行明确写了被什么阻断
- A5 生产历史（v10.0–v10.28）与 HANDOFF.md 和 CHECKPOINT.md 记录一致
- 矩阵不替代任何授权流程
