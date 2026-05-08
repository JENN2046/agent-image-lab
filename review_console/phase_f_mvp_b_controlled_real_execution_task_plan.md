# Phase F MVP-B 受控真实执行任务书

本文是 Phase F 的任务定义：把 Adapter dry-run、Review Console runtime prototype 和 A5 授权链整合成单一插件最小真实执行闭环。本阶段只做本地任务定义和授权门固化，不执行真实插件调用、不创建图片、不写 DailyNote/VCP memory，除非用户显式激活 A5 authorization package。

```yaml
phase_f_task_plan:
  status: completed_local_task_plan
  phase: "Phase F — MVP-B controlled real execution task plan"
  prerequisites:
    - "Phase C manifest sanitized review (done)"
    - "Phase D adapter dry-run (done)"
    - "Phase E subwindow integration preparation (done)"
    - "v10.19 DoubaoGen 2 real generations (1 accepted_candidate)"
    - "v10.25 DailyNoteWrite 1 real write (done)"
    - "v10.28 canonical location guard (done)"
  real_execution_performed: false
  plugin_called_in_this_phase: false
  image_created_in_this_phase: false
  daily_note_called_in_this_phase: false
```

## 进入条件

```yaml
entry_gates:
  phase_c_complete: true
  phase_d_complete: true
  phase_e_complete: true
  manifest_reviewed_safe: true
  dry_run_output_blocked: true
  user_authorization_present: "REQUIRED — 未提供时本任务书不可执行"
  active_a5_package_present: false
  a5_package_template: "docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md"
```

## 执行计划

Phase F 的执行分为 8 个阶段，每个阶段必须在上一阶段通过后才进行：

```yaml
execution_stages:
  - id: f1_preflight
    name: "A5 Preflight"
    description: "校验 A5 授权包完整性、外部工作树状态、bridge 可用性"
    requires: "active_a5_package with filled docs/231 template"
    outputs: "preflight pass/fail report"
    
  - id: f2_bridge_smoke
    name: "Bridge Smoke"
    description: "严格 allowlist bridge smoke (cancel/loadSession/previewDraft)"
    requires: "f1 passed"
    outputs: "bridge_calls_observed count, submitDraft_probe_result"
    max_bridge_calls: 3

  - id: f3_adapter_dry_run
    name: "Adapter Dry-Run Handoff"
    description: "运行 adapter_dry_run.js 对目标 fixture，生成 dispatch_plan_draft"
    requires: "f2 passed"
    outputs: "dispatch_plan_draft, gatekeeper_handoff, review_console_handoff"
    selected_plugin: null
    max_plugin_calls: 0

  - id: f4_plugin_generation
    name: "插件真实生图"
    description: "在人工审批后调用单一插件执行一次生图"
    requires: "f3 passed + human_review approval + explicit plugin authorization"
    selected_plugin_id: "DoubaoGen"
    selected_plugin_command: "generate"
    plugin_model: "doubao-seedream-5-0-260128"
    max_plugin_calls: 1
    max_image_outputs: 1
    runner_transport: "UTF-8 no BOM byte-write"

  - id: f5_asset_review
    name: "资产审查"
    description: "自动审片 + 人工覆盖"
    requires: "f4 completed"
    review_criteria:
      prompt_subject_match: true
      person_or_face_detected: false
      readable_text_or_logo_detected: false
    status_options: ["accepted_candidate", "needs_human_review", "rejected"]

  - id: f6_memory_draft
    name: "记忆草案"
    description: "为 accepted_candidate 生成本地中文 memory_delta 草案"
    requires: "f5 产出 accepted_candidate"
    outputs: "memory_delta_draft, memory_review_summary"
    write_mode: "draft"
    should_write_to_vcp: false

  - id: f7_memory_write
    name: "记忆写入"
    description: "人工审批 memory_delta 后通过 DailyNoteWrite 执行一次真实写入"
    requires: "f6 memory_draft approved by human"
    writer: "DailyNoteWrite"
    max_daily_note_writes: 1
    max_vcp_memory_writes: 1
    canonical_verification_required: true

  - id: f8_closeout
    name: "交付收束"
    description: "记录执行结果、更新索引、提交本地变更"
    requires: "f7 completed (or f5 rejected with closeout)"
    outputs: "execution_result.sanitized.json, write_execution_audit.sanitized.yaml"
    commit_allowed: true
    tag_allowed: true
    push_allowed: false
```

## Rollback 策略

```yaml
rollback:
  conditions:
    - "preflight 失败 → 停止，不进入后续阶段"
    - "bridge smoke 失败 → 记录缺失 surface，不调用插件"
    - "插件调用失败 → 不重试（max_plugin_calls=1 已消耗）"
    - "资产审片拒收 → 记录拒收原因，不进入 memory 阶段"
    - "记忆写入失败 → 记录失败原因，不重试，检查 canonical location"
    - "guard 污染 → 立即停止所有后续阶段"
  
  auto_retry: false
  state_restoration: "每阶段失败后恢复到该阶段前的状态"
```

## 禁止清单（Phase F 实施时）

```yaml
forbidden_in_phase_f:
  - "max_plugin_calls > 1"
  - "未授权的第二次生图"
  - "未审批的 memory write"
  - "submitDraft 调用"
  - "图片二进制写入 Git"
  - "raw path/endpoint/log/plugin output 记录在 Git"
  - "未经 canonical verification 的写入完成声明"
  - "plugin_success 作为写入完成的唯一证据"
```

## 历史对齐

Phase F 任务书整合了 v10.x A5 执行历史中的实际经验：

```yaml
historical_lessons:
  - source: "v10.3 bridge smoke"
    lesson: "strict allowlist-only bridge smoke 必须先于任何插件调用"
  - source: "v10.4/v10.5/v10.9/v10.13 rejected assets"
    lesson: "person/face/text/logo 检测是自动拒收的第一道防线"
  - source: "v10.14 model lock diagnostic"
    lesson: "runner transport 必须 UTF-8 no BOM；默认 PowerShell stdin 会损坏中文 prompt"
  - source: "v10.15/v10.18 runner patches"
    lesson: "byte-write transport 是兼容 Windows PowerShell 5.1 的最小变更"
  - source: "v10.25 DailyNoteWrite"
    lesson: "canonical location 校验必须在声明写入完成之前"
  - source: "v10.28 canonical location guard"
    lesson: "plugin_success != write_complete；必须验证 canonical file 存在和 hash 匹配"
```

## 资产处理规则

```yaml
asset_handling:
  accepted_candidate:
    - "记录 sanitized asset hash"
    - "记录 review scores"
    - "记录 中文脱敏 review summary"
    - "不保存图片二进制到 Git"
    - "不保存图片二进制到 VCP memory"
  needs_human_review:
    - "记录 risk reasons"
    - "等待人工判定"
  rejected:
    - "记录 rejection reasons"
    - "不进入 memory 阶段"
    - "可作为 historical negative example 归档"
```

## 验收标准（本 Phase F 任务书）

```yaml
phase_f_task_plan_acceptance:
  eight_stages_defined: true
  entry_gates_documented: true
  rollback_strategy_present: true
  forbidden_list_present: true
  historical_lessons_integrated: true
  asset_handling_rules_present: true
  a5_template_referenced: true
  no_real_execution_in_this_phase: true
```

## 进入 Phase F 实施的条件

```yaml
activation_requirements:
  - "用户显式填充 docs/231 consolidation template 并激活"
  - "activation phrase 明确"
  - "A5 preflight 全部通过"
  - "外部 VCPChat/VCPToolBox 工作树干净"
  - "runner transport 已通过 UTF-8 no BOM 验证"
  - "不满足以上任一条件时，本任务书仅为本地规划文档，不授权任何真实执行"
```

本任务书仅定义 Phase F 的范围和约束，不做为自动执行触发器。所有真实执行需匹配 `docs/231` consolidation template 形成 concrete active authorization package 后才能开始。
