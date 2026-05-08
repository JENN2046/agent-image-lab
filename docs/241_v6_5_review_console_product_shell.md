# v6.5 Review Console Product Shell Upgrade

## 任务标识

- **Task Name**: v6.5 Review Console Product Shell Upgrade
- **Phase**: v6.5
- **Status**: completed
- **Date**: 2026-05-09
- **Branch**: master
- **Base Commit**: 7a677fa

## 目标

将现有 Review Console 从"长页面原型"升级为"产品级审片台布局壳"。
不是重写业务逻辑，不是重做 Review Console，不是改安全模型。
只是把现有数据结构和 draft surfaces 投射到更像产品控制台的布局里。

## 为什么做 v6.5

v6.0–v6.4 完成了 Task/Asset/Session/Memory 四块核心数据结构和交互层，但 UI 仍然是"长页面原型"模式——30+ 个面板垂直堆叠在一个两列网格中。v6.5 把这四块收束成一个产品驾驶舱布局，让审片流程从左到右、从上到下自然流动。

## 这是 product shell，不是业务逻辑重写

- 所有 draft surfaces 保持原样
- 所有 element ID 保持原样
- runtime_guard 未放宽
- 所有 v6.0-v6.4 验证器全部通过
- draft_only / no-execution 边界未改动

## 新布局区域

### 左侧导航 (shell-left-nav)
- 评审台
- 候选队列
- 授权与记忆
- 交付归档
- 追踪矩阵
- 会话续航
- 系统设置

### 顶部流程条 (top-workflow)
- 候选 → 人工评审 → 风险复核 → 记忆申请 → 授权前复核 → 交付包 → 归档

### 中间主区域 (main-review-workspace)
- 评审头部（task/case/asset meta, versions, asset box, diff grid）
- 人工评审面板（score, comment, annotation, risk tags, quick actions）
- 记忆预览面板（memory content, memory approval）
- 草案视图卡片（review card, asset card, memory card）
- v6 Product Runtime（Task Panel, Asset Index, Session Store, Memory Queue）

### 右侧裁决栏 (shell-right-rail)
- Final Verdict（verdict title + reasons）
- 决策摘要（review status, asset conclusion, score band, memory status, write request, guard, next action）
- 记忆队列状态（approval, reviewer role, should_write_to_vcp, write_authorized, write_performed）
- 写入边界（memory completion state split）
- 评审前检查（preflight checklist）
- 主程序回执（host bridge ack）

### 底部操作区 (bottom-operations-grid)
- 候选队列（queue with filter/search/sort/batch/undo）
- 批量交接摘要（batch summary + preflight + report）
- 可追踪性矩阵（traceability matrix, full width）

### 分组区域
- 授权与记忆（preauth, auth-capsule, memory-completion-candidate, gen-retry-gate, memory-write-auth）
- 交付归档（delivery, asset-archive, bridge-roundtrip, real-bridge-auth, prompt-reliability, commit-scope）
- 会话续航（session-transfer, runtime-state）
- 系统设置与质量（quality/inspection, handoff, glossary）

## 保留的旧结构

以下核心结构完全未改动：
- review_session_draft
- image_case_draft
- memory_delta_draft
- memory_completion_state_draft
- v6_product_runtime_draft.task_panel
- v6_product_runtime_draft.asset_index
- v6_product_runtime_draft.session_store
- v6_product_runtime_draft.memory_queue
- runtime_guard.js（未放宽任何校验）
- 所有 300+ DOM element ID 保持不变

## No-execution 边界

```text
draft_only: true
side_effects_performed: false
write_authorized: false
write_performed: false
no plugin/API/DailyNote/VCP memory/image
no localStorage/sessionStorage/IndexedDB
no fs/fetch/XMLHttpRequest/child_process
```

## 修改文件

- `review_console/runtime_prototype/index.html` — 完整布局重组
- `review_console/runtime_prototype/styles.css` — 新增产品壳 CSS

## 新增文件

- `docs/241_v6_5_review_console_product_shell.md` — 本设计文档
- `scripts/validate_v6_5_review_console_product_shell.js` — v6.5 验证器

## 验证

所有 v6.0–v6.4 验证器保持通过。
v6.5 验证器检查：product shell HTML 结构、CSS、guard 未放宽、所有现有验证器仍可加载、无禁止 API 或术语。
