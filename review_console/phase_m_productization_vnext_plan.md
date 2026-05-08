# Phase M Productization vNext Plan

Agent Image Lab 从实验工具到长期产品化的路线图。本阶段只做规划文档，不执行实现。

```yaml
phase_m:
  status: completed_planning
  timestamp: "2026-05-08"
  phase: "Phase M — Productization vNext Plan"
  real_execution: false
```

## 1. Product Modules

### 1.1 任务面板 (Task Panel)

```yaml
task_panel:
  goal: "统一的生图任务创建、调度、追踪面板"
  current_state: "task_envelope schema 已定义，dry-run dispatch 已实现"
  needed:
    - "多任务队列管理"
    - "任务优先级和依赖"
    - "批量任务创建（从 prompt 库）"
    - "任务历史搜索和过滤"
    - "实时进度展示"
  a5_gates:
    - "真实插件调度"
```

### 1.2 审片台 (Review Console)

```yaml
review_console:
  goal: "完整的视觉审片工作台"
  current_state: "runtime prototype 已实现 16 draft surfaces + UI + session export/import"
  needed:
    - "Phase I: VCPChat embed v2 (A5 gated)"
    - "批量审片模式"
    - "对比审片（A/B test）"
    - "审片历史面板"
    - "快捷键和效率优化"
    - "审片台主题/布局自定义"
  a5_gates:
    - "VCPChat 文件修改"
    - "IPC handler 实现"
```

### 1.3 资产索引 (Asset Index)

```yaml
asset_index:
  goal: "所有生成资产的可搜索索引"
  current_state: "asset_archive_candidate_draft 已实现，Phase J metadata schema 已定义"
  needed:
    - "资产搜索（按 prompt/plugin/date/score/verdict）"
    - "资产标签系统"
    - "资产关联图（同一 prompt 的多版本追踪）"
    - "磁盘占用统计"
    - "过期资产清理策略"
  a5_gates:
    - "none (pure local)"
```

### 1.4 风格记忆 (Style Memory)

```yaml
style_memory:
  goal: "可积累、可复用、可审批的风格知识库"
  current_state: "memory_delta schema 已定义，memory_delta_draft 已实现，v10.25 完成一次真实写入"
  needed:
    - "风格卡片（从 memory_delta 提取可复用规则）"
    - "风格冲突检测"
    - "风格版本管理"
    - "风格推荐（基于 prompt 自动匹配已有风格规则）"
    - "风格记忆审批工作流"
  a5_gates:
    - "DailyNote/VCP memory 写入"
```

### 1.5 插件表现评分 (Plugin Performance Score)

```yaml
plugin_performance:
  goal: "多插件横向对比和评分仪表盘"
  current_state: "Phase K 已定义 6 个视觉评分维度 + Gatekeeper 风险分级"
  needed:
    - "评分聚合仪表盘"
    - "插件推荐引擎（基于 prompt 类型自动推荐最优插件）"
    - "历史表现趋势图"
    - "插件版本变更追踪"
    - "评分权重自定义"
  a5_gates:
    - "真实插件调用（采集评分数据）"
```

### 1.6 发布自动化 (Release Automation)

```yaml
release_automation:
  goal: "一键 release 发布流程"
  current_state: "tag strategy 已定义，Phase L RC package 已定义"
  needed:
    - "自动 zip + SHA256 打包"
    - "Release notes 自动生成（从 commit log）"
    - "CHANGELOG.md 自动维护"
    - "GitHub Release 创建脚本"
    - "版本号自动递增"
  a5_gates:
    - "GitHub Release 发布"
```

### 1.7 授权包管理器 (Authorization Package Manager)

```yaml
auth_package_manager:
  goal: "A5 授权包的创建、激活、消耗、过期管理"
  current_state: "docs/231 consolidation template 已定义，Phase F auth package 已实战使用"
  needed:
    - "授权包模板库（bridge/plugin/memory/version 分类）"
    - "授权包激活历史"
    - "消耗计数自动递减"
    - "过期提醒"
    - "授权包预填向导"
  a5_gates:
    - "none (management tooling)"
```

### 1.8 Runtime Smoke Dashboard

```yaml
smoke_dashboard:
  goal: "实时 runtime 健康检查仪表盘"
  current_state: "validate_runtime_review_full_chain.js 已实现（12 项检查），runtime suite 9/9 passed"
  needed:
    - "Web UI 仪表盘"
    - "定时自动 smoke test"
    - "历史 smoke 结果追踪"
    - "失败告警（agent-board 标记）"
    - "smoke 覆盖率报告"
  a5_gates:
    - "none (pure local)"
```

## 2. Implementation Priority

```yaml
priority:
  p0_blockers:
    - "Phase I: VCPChat embed v2 (unblocks Review Console production use)"
  
  p1_high:
    - "Asset Index (pure local, high value)"
    - "Auth Package Manager (makes A5 workflow smoother)"
    - "Smoke Dashboard (keeps quality visible)"

  p2_medium:
    - "Plugin Performance Score (needs more generation data)"
    - "Style Memory (needs more memory writes)"
    - "Release Automation (useful when releasing frequently)"

  p3_nice_to_have:
    - "Task Panel enhancements"
    - "Review Console batch/compare modes"
```

## 3. Technology Stack (No Change)

```yaml
tech_stack:
  runtime: "Node.js + Electron (VCPChat)"
  prototype: "Vanilla JS + HTML + CSS"
  validators: "Node.js (native modules only, no external deps)"
  plugins: "VCPToolBox Plugin API"
  memory: "DailyNote + VCP Memory"
  auth: "A5 authorization package system"
```

## 4. Non-Goals

```yaml
non_goals:
  - "不引入外部 SaaS / cloud 依赖"
  - "不引入新的编程语言或框架"
  - "不改变 VCP 生态的现有安全模型"
  - "不把审片台做成公开 Web 服务"
  - "不引入用户账号系统"
```

## 5. Acceptance

```yaml
phase_m_acceptance:
  all_8_modules_defined: true
  implementation_priority_set: true
  a5_gates_per_module: true
  non_goals_explicit: true
  phase_chain_complete: "G → H → J → K → L → M (Phase I deferred)"
  full_g_m_chain_landed: true
```
