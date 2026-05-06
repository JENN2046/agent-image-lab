# v6.0 Next Milestone Planning

本文记录 v5.16 release publication preflight 之后的下一轮里程碑规划。该阶段只做路线拆解和下一阶段授权边界记录；不创建 tag，不重新打包，不发布 GitHub Release，不上传资产，不读取真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现，不调用插件、API、DailyNote，不创建图片，也不写 VCP 记忆。

```yaml
status: completed_validated_project_local_v6_0_next_milestone_planning
version: v6.0
current_phase: "v6.0 next milestone planning"
validation_file: scripts/validate_v6_0_next_milestone_planning.js
current_head: e31e57e
previous_phase: "v5.16 release publication preflight"
release_candidate_tag: v5.14-release-candidate-validation-baseline
release_publication_preflight_ready: true
github_release_published: false
```

## Planning Goal

```yaml
planning_goal:
  summary_cn: "把 v5.x release candidate 与发布前置材料之后的工作拆成 v6.x 可执行小阶段。"
  primary_direction_cn: "优先推进本仓库内 Runtime 产品面、状态模型、host bridge 草案、Adapter 到 Review Console 的本地回合样例，以及记忆交接状态显示。"
  release_track_kept_separate: true
  implementation_not_authorized_by_this_record: true
```

## Current Baseline

```yaml
current_baseline:
  repository: JENN2046/agent-image-lab
  branch: master
  head_commit_short: e31e57e
  previous_record: docs/141_v5_16_release_publication_preflight.md
  previous_validation: scripts/validate_v5_16_release_publication_preflight.js
  release_candidate_tag: v5.14-release-candidate-validation-baseline
  release_package_sha256: 2fa0204a855ea9b74a36c5f8bf701356dd35414d3b35d3e85e1bf367492197db
  github_release_published: false
  release_assets_uploaded: false
```

## Work Tracks

```yaml
work_tracks:
  - id: release_track
    name: "v5.17 GitHub Release Publication Authorization"
    purpose_cn: "如果用户决定发布 v5.14 release candidate GitHub Release，则进入独立发布授权点。"
    allowed_now: false
    explicit_authorization_required: true
    side_effect_risk: remote_write
    stop_condition_cn: "没有明确发布授权时不得创建 GitHub Release 或上传资产。"

  - id: runtime_product_track
    name: "v6.1 Runtime Product Surface Audit"
    purpose_cn: "盘点当前 Review Console runtime prototype、静态原型、schema、样例和 task panel 状态面，确认哪些可以进入实现型产品面。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_docs_only
    stop_condition_cn: "不得创建真实 IPC/preload/renderer 运行时代码。"

  - id: runtime_state_track
    name: "v6.2 Runtime State Model Alignment"
    purpose_cn: "对齐 review_session_draft、image_case_draft、memory_delta_draft、task_panel_status 和 prototype_guard 的状态模型。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_docs_schema_examples_only
    stop_condition_cn: "不得调用 DailyNote、VCP 插件、API 或文件系统写入执行逻辑。"

  - id: host_bridge_track
    name: "v6.3 Host Bridge Contract v2"
    purpose_cn: "在本仓库内补齐未来 VCPChat host bridge 的 contract v2 草案，仍只写文档、contract、样例和 checklist。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_contract_only
    stop_condition_cn: "不得读取真实 VCPChat，不得创建 preload 或 IPC handler。"

  - id: adapter_review_console_track
    name: "v6.4 Adapter -> Review Console Runtime Roundtrip Fixture"
    purpose_cn: "设计 Adapter dry-run 结果进入 Review Console runtime，再输出 review_session/image_case/memory_delta 草案的本地回合样例。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_fixture_only
    stop_condition_cn: "不得选择真实插件，不得调用插件，不得生成图片。"

  - id: memory_handoff_track
    name: "v6.5 Memory Handoff Runtime Status"
    purpose_cn: "补齐记忆写入申请在 runtime 状态面中的展示和审计草案，不执行 DailyNote 写入。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_docs_examples_only
    stop_condition_cn: "不得写 DailyNote，不得写 VCP 长期记忆。"

  - id: vcpchat_integration_track
    name: "v6.6 VCPChat Embed Implementation Preflight"
    purpose_cn: "进入真正嵌入实现前的最终 preflight 规划，仍不读取真实 VCPChat，不创建实现代码。"
    allowed_now: true
    explicit_authorization_required: false
    side_effect_risk: local_preflight_only
    stop_condition_cn: "任何真实 VCPChat 读取或代码改动必须再次独立授权。"
```

## Recommended v6.x Sequence

```yaml
recommended_sequence:
  - phase: v6.1
    title: "Runtime Product Surface Audit"
    output_cn: "当前 runtime / Review Console / task panel / schema 可产品化面的只读审计记录。"
  - phase: v6.2
    title: "Runtime State Model Alignment"
    output_cn: "review_session、image_case、memory_delta、task_panel_status 与 prototype_guard 的状态对齐样例。"
  - phase: v6.3
    title: "Host Bridge Contract v2"
    output_cn: "VCPChat host bridge contract v2 草案、字段映射和安全 checklist。"
  - phase: v6.4
    title: "Adapter -> Review Console Runtime Roundtrip Fixture"
    output_cn: "只使用占位 dry-run 数据的本地 roundtrip fixture。"
  - phase: v6.5
    title: "Memory Handoff Runtime Status"
    output_cn: "记忆写入申请、审批状态、拒绝摘要和 no-write runtime 状态样例。"
  - phase: v6.6
    title: "VCPChat Embed Implementation Preflight"
    output_cn: "进入真实 VCPChat 嵌入实现前的授权门槛和风险清单。"
  - phase: v6.7
    title: "Release or Integration Decision Gate"
    output_cn: "判断是否发布 v5.14 release、是否进入 runtime 实现、或是否继续补齐本地 fixture。"
```

## Boundary State

```yaml
boundary_state:
  tag_creation_required_now: false
  package_creation_required_now: false
  github_release_created: false
  github_release_published: false
  release_assets_uploaded: false
  release_publish_authorized: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  adapter_execution_entrypoint_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
```

## Stop Gates

```yaml
stop_gates:
  github_release_publication:
    allowed_without_new_authorization: false
    required_authorization_cn: "明确授权发布 GitHub Release 并上传资产。"
  real_vcpchat_read:
    allowed_without_new_authorization: false
    required_authorization_cn: "明确填写真实根目录、允许读取文件、读取命令和脱敏规则。"
  runtime_implementation:
    allowed_without_new_authorization: false
    required_authorization_cn: "明确授权创建 IPC/preload/renderer 或其他运行时代码。"
  plugin_or_api_execution:
    allowed_without_new_authorization: false
    required_authorization_cn: "明确限定插件、命令、模型、调用次数、输入引用、输出目录和回滚方案。"
  dailynote_or_vcp_memory_write:
    allowed_without_new_authorization: false
    required_authorization_cn: "明确授权 DailyNote / VCP 记忆写入执行，并保留回滚/撤销记录。"
```

## Acceptance Meaning

v6.0 表示下一轮产品化和 runtime 方向已经拆成可执行的小阶段，并且 release 发布、真实 VCPChat 读取、runtime 实现、插件/API/DailyNote 调用仍被硬边界隔离。它不是发布动作，也不是实现动作。

默认推荐下一步是进入 `v6.1 Runtime Product Surface Audit`，先只读盘点当前可产品化表面，再决定是否进入更具体的本地文档/样例补齐。
