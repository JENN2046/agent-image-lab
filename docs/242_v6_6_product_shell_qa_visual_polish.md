# v6.6 Product Shell QA + Visual Polish

## 目的

v6.5 已将 Review Console 从长页面原型升级为产品级审片驾驶舱（左侧导航 + 顶部流程 + 中央审片区 + 右侧裁决栏 + 底部操作区）。

v6.6 在 v6.5 基础上进行质量复查、布局修整、可读性优化、视觉一致性和验收加固——不新增业务模块，不重构 Review Console，不接真实生产执行。

## v6.5 产品壳保留的核心结构

本轮回溯验证了 v6.5 产品壳的以下核心结构：

| 区域 | 用途 |
| --- | --- |
| `shell-left-nav` | 左侧导航，7 个入口：评审台、候选队列、授权与记忆、交付归档、追踪矩阵、会话续航、系统设置 |
| `top-workflow` | 顶部流程条，7 个步骤：候选 → 人工评审 → 风险复核 → 记忆申请 → 授权前复核 → 交付包 → 归档 |
| `main-review-workspace` | 中央审片区，包含评审头、人工评审、记忆预览、草案视图、v6 Product Runtime 层 |
| `shell-right-rail` | 右侧裁决栏，展示最终裁决、决策摘要、记忆队列状态、写入边界、评审前检查、主程序回执 |
| `bottom-operations-grid` | 底部操作区，包含候选队列、批量交接摘要、Human Override 追踪矩阵 |

## QA 覆盖区域

本轮 QA 覆盖以下六个方面：

1. **结构完整性** — 确认五大区域 DOM 元素和 ID 存在且未断
2. **导航完整性** — 左侧 7 个入口、顶部 7 个步骤均保持正确
3. **旧功能保留** — v6.0–v6.5 所有 DOM ID、表单、面板、按钮、v6 Product Runtime 均未删除
4. **右侧裁决栏数据投射** — final verdict、score band、memory status、write_authorized/false、write_performed/false 均从已有 draft 数据投射，无写死假结论
5. **Validator 兼容** — v6.0–v6.5 所有 validator 和 runtime suite 仍可加载
6. **no-execution 边界** — runtime_guard 未放宽，所有 execution flag 保持 false

## 视觉修整内容

本轮仅做轻量视觉优化，未重新设计：

- **右侧栏可读性**: 增加 rail-card 内边距 (10px→12px)，dt/dd 字重和颜色优化
- **导航 active 状态**: 当前选中项增加 `font-weight: 500`
- **顶部流程条状态**: 新增 `data-completed`（绿色点）、`data-risk`（橙色点）、`data-blocked`（红色点）语义状态
- **卡片层级**: 所有 panel 增加轻微 `box-shadow`
- **标题层级**: h1/h2 统一字重和间距，section-group-title 增加底部边框
- **颜色语义**: checklist 新增 `data-state="error"` / `data-state="blocked"` 状态样式
- **响应式**: 增加 1200px 和 1000px 过渡断点，导航和右侧栏逐步缩小

## 禁止触碰项

本轮严格遵守以下边界：

- 不修改真实 VCPChat / VCPToolBox
- 不调用插件、API、DailyNote
- 不写 VCP memory、不创建图片
- 不读取真实图片文件或输出目录
- 不新增依赖
- 不 push、tag、release、开 PR
- 不 force push、reset、rebase、amend
- 不使用 localStorage / sessionStorage / IndexedDB
- 不使用 fs / fetch / XMLHttpRequest / child_process
- 不把 should_write_to_vcp 解释成已写入
- 不把 memory queue approved 解释成已授权真实写入
- 不删除已有 DOM ID
- 不隐藏核心功能

## no-execution 边界确认

所有 runtime 文件（index.html、styles.css、app.js、runtime_guard.js）保持：

- `api_called: false`
- `daily_note_called: false`  
- `vcp_plugin_called: false`
- `disk_write_performed: false`
- `image_file_created: false`

右侧裁决栏的 `write_authorized` 和 `write_performed` 固定显示 `false`。

## 验证命令

```powershell
# 语法检查
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js

# v6.6 validator
node --check scripts/validate_v6_6_product_shell_qa.js
node scripts/validate_v6_6_product_shell_qa.js

# v6 全系列 validator
node scripts/validate_v6_5_review_console_product_shell.js
node scripts/validate_v6_4_memory_queue_interaction.js
node scripts/validate_v6_3_session_store_interaction.js
node scripts/validate_v6_2_asset_index_interaction.js
node scripts/validate_v6_1_task_panel_interaction.js
node scripts/validate_v6_0_product_runtime_kickoff.js

# Runtime suite
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js

# Agent board
node scripts/validate_agent_board_state.js

# MVP 全套
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

## 后续建议

完成 v6.6 验收后，下一步可考虑对 Review Console 进行实际运行验证（通过 `node scripts/validate_runtime_prototype_smoke.js` 和 `node scripts/validate_runtime_prototype_suite.js` 确认全套功能完整性），然后进入 v6.7 增量开发或产品化完善。
