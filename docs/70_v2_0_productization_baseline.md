# 70 v2.0 Productization Baseline

本文定义 Agent Image Lab v2.0 Productization Baseline。该 baseline 把 v1.1 到 v1.8 的规划、schema、样例和验收边界汇总为产品化基线，但不新增真实插件调用、DailyNote 写入、VCP 长期记忆写入、VCPChat 修改、VCPToolBox 修改、tag、package 或 GitHub Release。

## Baseline Decision

```yaml
v2_0_productization_baseline:
  status: baseline_ready_no_execution
  can_use_as_productization_reference: true
  can_execute_real_plugin_by_default: false
  can_write_daily_note_by_default: false
  can_select_plugin_automatically: false
  can_modify_vcpchat_by_default: false
  can_modify_vcptoolbox_by_default: false
  can_publish_release_by_default: false
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
| v1.8 v2.0 Baseline Readiness | complete | `docs/60_v2_0_productization_baseline_readiness.md` |

## Product Modules

### Task Panel

证据：

- `task_panel/task_panel_product_spec.md`
- `task_panel/task_panel_state.schema.yaml`
- `tests/schema_examples/v1_5_task_panel_state.example.yaml`

边界：

- 只展示状态和下一授权点。
- 不实现真实 UI。
- 不触发插件、API、DailyNote、文件写入或图片创建。

### Review Console

证据：

- `review_console/runtime_prototype/`
- `review_console/v1_1_vcpchat_review_console_contract.md`
- `review_console/v1_6_embed_boundary_contract.md`
- `review_console/embed_readiness_checklist.md`

边界：

- runtime prototype 只在项目内运行。
- 真实 VCPChat 嵌入仍需独立授权。
- 不创建真实 IPC handler。
- renderer 不直接调用 DailyNote、插件、API 或文件系统。

### Asset Index

证据：

- `asset_index/asset_index_policy.md`
- `asset_index/asset_index.schema.yaml`
- `tests/schema_examples/v1_6_asset_index.example.yaml`

边界：

- 只记录资产引用、SHA256、评分、状态、人工审批和视觉偏差。
- 不保存图片二进制。
- 不保存 raw 插件输出、runtime log 原文、endpoint 原文或敏感信息。

### Style Memory

证据：

- `memory_policy/v1_3_daily_note_handoff_contract.md`
- `tests/schema_examples/v1_3_memory_write_authorization_chain.example.yaml`

边界：

- `should_write_to_vcp=true` 只表示写入申请。
- `write_mode=confirmed` 不代表 DailyNote 已写。
- DailyNote 写入必须未来单独授权。
- 图片二进制永不进入 memory_delta、DailyNote 或 VCP 长期记忆。

### Plugin Performance Score

证据：

- `integrations/vcp/plugin_performance_score_policy.md`
- `integrations/vcp/plugin_performance_score.schema.yaml`
- `tests/schema_examples/v1_7_plugin_performance_score.example.yaml`

边界：

- `tested` 不代表真实执行授权。
- `dry_run_checked` 不代表真实执行授权。
- `accepted_by_human` 不代表插件可自动执行。
- 不保存 raw 插件输出、endpoint 原文、secret、私密路径、客户隐私、runtime log 原文或图片二进制。

### Release Automation

证据：

- `release_automation/release_preflight_contract.md`
- `release_automation/package_validation_checklist.md`
- `tests/schema_examples/v1_7_release_preflight.example.yaml`

边界：

- 只做 release preflight contract。
- 不创建 tag。
- 不生成 zip 或 sha256。
- 不发布 GitHub Release。
- 不上传 release asset。
- `release_packages/` 必须保持 Git ignored。

## Preserved Non-goals

v2.0 baseline 不默认包含：

- 自动真实生图。
- 自动 DailyNote 写入。
- 自动插件选择。
- 客户门户。
- 外链分享。
- 复杂权限系统。
- 未授权读取 VCPToolBox / VCPChat 私有配置。
- 未授权 GitHub Release 发布。

## Baseline Guards

```yaml
baseline_guards:
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
  real_manifest_read: false
  real_execution_allowed: false
  vcpchat_modified: false
  vcptoolbox_modified: false
  tag_created: false
  package_created: false
  sha256_created: false
  release_published: false
  release_assets_uploaded: false
```

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_0_closeout_or_release_preflight
  authorization_required: true
  allowed_after_authorization:
    - v2.0 closeout read-only validation
    - optional tag/package/release preflight planning
  forbidden_without_authorization:
    - create tag
    - generate package
    - publish GitHub Release
    - call plugin
    - call API
    - call DailyNote
    - modify VCPChat
    - modify VCPToolBox
```

## Acceptance

- `scripts/validate_mvp.ps1` 通过。
- 工作区干净。
- v2.0 baseline 样例存在。
- no-execution scan 通过。
- no-release-action scan 通过。
- no-secret scan 通过。
- 新增文件不包含图片、zip、sha256 或执行入口。
