# Phase L Release Candidate / vNext Package

把 Phase G–K 形成一个新的可发布候选版本。全项目 validation、tag、验收。

```yaml
phase_l:
  status: completed_rc_package
  timestamp: "2026-05-08"
  phase: "Phase L — Release Candidate / vNext Package"
  real_execution: false
  version_action: true (commit + tag only)
```

## 1. Phase G–K Summary

| Phase | Name | Status | Key Deliverable |
| --- | --- | --- | --- |
| G | Baseline Hygiene | ✅ | State correction, baseline closeout |
| H | Runtime Hardening | ✅ | 16 surfaces audit, state matrix, 7 hardening rules |
| J | Asset Archive + Memory Pipeline | ✅ | Metadata schema, Archivist/Master roles, DailyNote preflight |
| K | Multi-Plugin Evaluation | ✅ | 5-plugin matrix, scoring dimensions, Gatekeeper risk levels |

## 2. Full Project Validation

```yaml
validation_results:
  runtime_prototype_suite: "9/9 passed"
  full_chain_validator: "6/6 batches passed"
  agent_board_state: "passed"
  local_commit_scope: "passed"
  git_diff_check: "passed"
  forbidden_output_scan: "clean"
```

## 3. Deliverable Inventory

### Docs (16 new since Phase F baseline)

```yaml
new_docs:
  phase_g: "docs/234_phase_g_baseline_hygiene_closeout.md"
  phase_h: "review_console/phase_h_runtime_product_hardening.md"
  phase_j: "review_console/phase_j_asset_archive_and_memory_write_pipeline.md"
  phase_k: "review_console/phase_k_multi_plugin_candidate_evaluation.md"
  phase_l: "review_console/phase_l_release_candidate_vnext_package.md"  # this file
```

### Previous Chain (Phase A–F)

```yaml
existing_docs:
  phase_e: 3 files (task plan, IPC contract, security checklist 77 checks)
  phase_f: 7 files (task plan, F1/F2/F8 records, retrospective, auth package, prompt)
  batch_10: 4 files (229-232, replay index, acceptance matrix, consolidation, checkpoint)
  batch_9: 3 files (226-228, freshness, runbook, compatibility)
  strategy: "docs/233_tag_and_version_strategy.md"
```

### Validators

```yaml
validators:
  dedicated: 6 (9A, 9B, 9C, 10A, 10B, 10C)
  aggregator: "validate_runtime_review_full_chain.js"
  runtime: "validate_runtime_prototype_suite.js (9 checks)"
  agent_board: "validate_agent_board_state.js"
  commit_scope: "validate_local_commit_scope.js"
```

## 4. vNext Baseline Definition

```yaml
vnext_baseline:
  label: "v5.28-phase-l-rc-package"
  commit: "to be tagged"
  included_phases: "A, B, C, D, E, F, G, H, J, K, L"
  phase_m_pending: "Productization vNext"
  skipped: "Phase I (VCPChat Embed v2 — requires VCPChat modification authorization)"
```

## 5. Phase I Status

Phase I (VCPChat Embed v2) 需要修改 VCPChat 文件、preload allowlist 复查、IPC sender validation 复查 — 全部属于 A5 gated 操作。Phase E 已完成 IPC 契约设计和安全清单（77 项），Phase F 已完成 bridge smoke 验证。Phase I 的实际 VCPChat 修改留待后续授权。

```yaml
phase_i_deferred:
  reason: "all tasks require VCPChat file modification (A5 gated)"
  ready_when: "user authorizes VCPChat modification"
  preparation_done:
    - "Phase E IPC contract draft (4 channels)"
    - "Phase E security checklist (77 checks)"
    - "Phase F F2 bridge smoke verified"
```

## 6. Package Integrity

```yaml
package_integrity:
  master_synced: true
  working_tree_clean: true
  all_validators_pass: true
  no_forbidden_outputs: true
  tags_in_order: true
  git_history_linear: true
```

## 7. Next Steps (Phase M)

```yaml
phase_m_preview:
  name: "Productization vNext"
  modules:
    - "任务面板 (Task Panel)"
    - "审片台 (Review Console)"
    - "资产索引 (Asset Index)"
    - "风格记忆 (Style Memory)"
    - "插件表现评分 (Plugin Performance Score)"
    - "发布自动化 (Release Automation)"
    - "授权包管理器 (Authorization Package Manager)"
    - "Runtime Smoke Dashboard"
  status: "planning — to be defined"
```

## 8. Acceptance

```yaml
phase_l_acceptance:
  all_phases_g_k_documented: true
  full_validation_passed: true
  deliverable_inventory_complete: true
  vnext_baseline_defined: true
  phase_i_deferred_documented: true
  phase_m_preview_provided: true
  no_real_execution: true
  rc_ready: true
```
