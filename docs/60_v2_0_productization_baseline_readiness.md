# 60 v2.0 Productization Baseline Readiness

本文汇总 v1.1 到 v1.7 的产品化前置工作，判断 Agent Image Lab 是否已经具备进入 v2.0 Productization Baseline 的条件。本文只做 readiness 记录，不授权真实插件调用、DailyNote 写入、VCP 长期记忆写入、VCPChat 修改、VCPToolBox 修改、tag、package 或 GitHub Release。

## Current Readiness

```yaml
readiness:
  checkpoint: v1.8_v2_0_productization_baseline_readiness
  repo_state: ready_for_v2_0_baseline_planning
  v2_0_entry_recommendation: conditional_pass
  no_execution_guard_active: true
  release_action_authorized: false
```

## Completed Tracks

| Track | Status | Evidence |
| --- | --- | --- |
| v1.1 VCPChat Review Console Integration Plan | complete | `review_console/v1_1_vcpchat_review_console_contract.md` |
| v1.2 Runtime Prototype | complete | `review_console/runtime_prototype/` |
| v1.3 Memory / DailyNote Handoff | complete | `memory_policy/v1_3_daily_note_handoff_contract.md` |
| v1.4 Multi-plugin Candidate Evaluation | complete | `integrations/vcp/v1_4_multi_plugin_candidate_evaluation.md` |
| v1.5 Task Panel Status Backbone | complete | `task_panel/` |
| v1.6 Asset Index | complete | `asset_index/` |
| v1.6 Review Console Embed Readiness | complete | `review_console/v1_6_embed_boundary_contract.md` |
| v1.7 Plugin Performance Score | complete | `integrations/vcp/plugin_performance_score_policy.md` |
| v1.7 Release Automation Readiness | complete | `release_automation/release_preflight_contract.md` |

## v2.0 Module Readiness

### Task Panel

- 已有状态骨架。
- 已覆盖 task、dispatch、review、memory、asset、plugin candidate、Gatekeeper 和 next authorization point。
- 仍不实现 UI，不触发真实动作。

### Review Console

- 已有 runtime prototype。
- 已有 embed boundary contract。
- 仍不修改真实 VCPChat，不创建真实 IPC handler。

### Asset Index

- 已有 policy、schema 和样例。
- 只记录资产引用、SHA256、评分、状态、人工审批和视觉偏差。
- 不保存图片二进制或 raw 插件输出。

### Style Memory

- 已有 memory handoff contract 和授权链样例。
- `should_write_to_vcp=true` 仍只表示写入申请，不代表 DailyNote 已写。
- DailyNote 写入仍需独立授权。

### Plugin Performance Score

- 已有 policy、schema 和样例。
- `tested`、`dry_run_checked`、`accepted_by_human` 均不代表真实执行授权。
- 不保存 raw 插件输出、endpoint 原文、secret、私密路径、客户隐私或图片二进制。

### Release Automation

- 已有 release preflight contract 和 package validation checklist。
- 当前不创建 tag、zip、sha256 或 GitHub Release。
- 任何发布动作都必须单独授权。

## Non-goals Preserved

v2.0 baseline 不默认包含：

- 自动真实生图。
- 自动 DailyNote 写入。
- 自动插件选择。
- 客户门户。
- 外链分享。
- 复杂权限系统。
- 未授权读取 VCPToolBox / VCPChat 私有配置。
- 未授权发布 GitHub Release。

## Remaining Conditions

进入 v2.0 baseline 前仍需保持：

- `scripts/validate_mvp.ps1` 通过。
- 工作区干净。
- no-execution scan 通过。
- no-release-action scan 通过。
- no-secret scan 通过。
- release package 不进入 Git。

## Recommended v2.0 Baseline Scope

v2.0 baseline 的第一步应只做总览和验收：

```text
docs/70_v2_0_productization_baseline.md
tests/schema_examples/v2_0_productization_baseline.example.yaml
tests/validation_checklist.md
```

该 baseline 应汇总模块，不新增真实执行能力。

## Readiness Decision

```yaml
decision:
  can_enter_v2_0_baseline_planning: true
  can_execute_real_plugin_by_default: false
  can_write_daily_note_by_default: false
  can_modify_vcpchat_by_default: false
  can_modify_vcptoolbox_by_default: false
  can_publish_release_by_default: false
  next_authorization_point: v2_0_productization_baseline_patch
```
