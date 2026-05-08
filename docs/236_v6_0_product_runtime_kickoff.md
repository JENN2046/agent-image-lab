# v6.0 Product Runtime Kickoff

把 Agent Image Lab 从治理闭环推进到可日常使用的视觉生产运行台。

```yaml
v6_0_kickoff:
  status: kicked_off
  timestamp: "2026-05-08"
  phase: "v6.0 Product Runtime Kickoff"
  previous: "v5.35 Final Program Closeout"
  mode: "A4.5 Smart Local Autopilot"
  real_execution: false
```

## 1. Why Now

当前仓库状态：
- 13 个 phase 全部完成（A→M）
- 7 个 batch 全部完成（9A→10C）
- 50+ validators, 65 tags, 221 commits
- 治理文档链完整且经过机器验证

**风险**：继续扩展治理文档会导致"流程宪法"过厚而"产品运行时"偏薄。
**决策**：从现在开始，主线转为产品运行时实现。不再以 closeout/authorization/checkpoint 文档为主要交付物。

## 2. v6.x Product Goals

| Goal | Description |
| --- | --- |
| 1. 可运行 | 每个模块都有可交互的 UI 界面，不只是 draft schema |
| 2. 可验证 | 每个模块都有对应的 smoke 检查项 |
| 3. 可组合 | 模块间通过 draft surface 互联，不通过全局变量或隐式依赖 |
| 4. 可扩展 | 新模块可以独立添加，不影响已有模块 |
| 5. No-Execution | 所有模块保持 draft_only，不调用插件/API/DailyNote/VCP memory |

## 3. Module Split

| # | Module | P0/P1/P2 | Input | Output | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Task Panel | P0-1 | 用户新建任务 | task_envelope draft | planned |
| 2 | Asset Index | P0-2 | 生图输出元数据 | asset_index_entry draft | planned |
| 3 | Session Store | P0-3 | session export/import | session_store_snapshot draft | planned |
| 4 | Memory Queue | P1 | memory_delta drafts | memory_approval_queue draft | planned |
| 5 | Plugin Dashboard | P1 | 插件调用历史 | plugin_score_card draft | planned |
| 6 | Release Panel | P2 | tag + validation status | release_readiness_card draft | planned |

### 3.1 P0-1: Task Panel

```yaml
task_panel:
  goal: "创建和管理视觉生产任务"
  input:
    - "user-provided task description (CN)"
    - "prompt reference"
    - "target plugin preference"
  output:
    - "task_envelope draft (draft_only)"
    - "task_queue list"
    - "task status: draft / submitted / in_review / completed"
  states:
    - "empty: 无任务"
    - "drafting: 正在填写任务"
    - "ready: 任务已就绪"
    - "archived: 已完成归档"
  forbidden:
    - "不调用插件执行任务"
    - "不写 DailyNote"
    - "不读 config.env / token"
```

### 3.2 P0-2: Asset Index

```yaml
asset_index:
  goal: "可搜索的生成资产元数据索引"
  input:
    - "asset metadata (from Phase J schema)"
    - "review verdicts"
    - "prompt references"
  output:
    - "asset_index_entry draft"
    - "searchable asset list (by prompt/plugin/date/verdict)"
    - "asset statistics"
  states:
    - "empty: 无资产"
    - "indexed: 已索引"
    - "archived: 已归档"
  forbidden:
    - "不保存图片二进制"
    - "不读真实文件系统（除 runs/ 引用）"
    - "不暴露 raw path"
```

### 3.3 P0-3: Session Store

```yaml
session_store:
  goal: "session 的持久化存储和恢复"
  input:
    - "runtime_review_session_v1 export"
    - "import preview"
  output:
    - "session_store_snapshot draft"
    - "session list with timestamps"
    - "search/filter by session_id, task_id, date"
  states:
    - "empty: 无 session"
    - "stored: 已存储"
    - "restored: 已恢复"
  forbidden:
    - "不写 VCP memory"
    - "不调用外部 API"
    - "不暴露 raw session payload"
```

## 4. First Batch Scope

```yaml
first_batch:
  modules: ["Task Panel", "Asset Index", "Session Store"]
  deliverables:
    - "v6_product_runtime_draft surface (in runtime prototype)"
    - "Module status UI (in index.html)"
    - "Smoke test extension"
    - "docs/236 (this doc)"
  not_in_first_batch:
    - "Memory Queue"
    - "Plugin Dashboard"
    - "Release Panel"
```

## 5. Boundary

```yaml
boundary:
  mode: "A4.5 Smart Local Autopilot"
  allowed:
    - "修改 review_console/runtime_prototype/ (HTML/JS/CSS)"
    - "修改 scripts/ 下 validator"
    - "新增 docs/"
    - "修改索引文件 (README, MANIFEST, roadmap, etc.)"
    - "修改 .agent_board/"
  forbidden:
    - "重写 VCPToolBox"
    - "重写 VCPChat"
    - "真实调用插件"
    - "真实生图"
    - "写 DailyNote / VCP memory"
    - "push / tag / release"
    - "读 .env / config.env / token / cookie / secret"
    - "修改外部仓库"
    - "npm install / 依赖变更"
```

## 6. Acceptance

```yaml
v6_0_acceptance:
  kickoff_doc_complete: true
  v6_draft_surface_added: true
  ui_section_added: true
  smoke_test_extended: true
  all_indexes_synced: true
  agent_board_updated: true
  runtime_prototype_suite_passes: true
  no_execution_maintained: true
```
