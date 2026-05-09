# v6 Product Runtime — Operator Runbook

## 当前架构（文字版）

```
v6 Product Runtime (Review Console runtime prototype)
├── v6.1 Task Panel        — 视觉目标 / 阶段 / 负责人 / 阻断原因
├── v6.2 Asset Index       — 资产条目编辑 / 筛选 / review score
├── v6.3 Session Store     — 会话管理 / 导入预览 / 恢复候选
├── v6.4 Memory Queue      — 记忆草案队列 / 审批 / write intent
├── v6.5 Product Shell     — 左栏导航 / 顶栏流程 / 中央工作区 / 右栏裁决 / 底栏操作
├── v6.6 Shell QA          — 视觉优化 / 响应式布局
├── v6.7 Final Acceptance  — 验收基线 / 全 validator 锁仓
├── v6.8 Plugin Dashboard  — 插件选择 / 参数映射 / dry-run 切换 / 调度状态
│   └── v6.8B Guard        — v6DispatchPlanIsSafe() (18 checks)
├── v6.9 Release Panel     — 发布准备状态 / validator 状态 / 安全字段
│   └── v6.9B Guard        — v6ReleaseReadinessIsSafe() (12 checks)
└── v6.10 RC Matrix        — 全模块可验收矩阵
```

## 如何启动本地原型

```bash
# 直接浏览器打开（静态文件，无需 server）
start review_console/runtime_prototype/index.html
# 或
firefox review_console/runtime_prototype/index.html
```

## 如何运行验证链

```bash
# 单文件语法检查
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js

# 完整验证链
node scripts/validate_v6_0_product_runtime_kickoff.js
node scripts/validate_v6_1_task_panel_interaction.js
node scripts/validate_v6_2_asset_index_interaction.js
node scripts/validate_v6_3_session_store_interaction.js
node scripts/validate_v6_4_memory_queue_interaction.js
node scripts/validate_v6_5_review_console_product_shell.js
node scripts/validate_v6_6_product_shell_qa.js
node scripts/validate_v6_7_product_runtime_final_acceptance.js
node scripts/validate_v6_8_plugin_dashboard.js
node scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js
node scripts/validate_v6_9a_release_panel_draft_surface.js
node scripts/validate_v6_9b_release_panel_guard_hardening.js
node scripts/validate_v6_10_product_runtime_rc_readiness_matrix.js
node scripts/validate_v6_validator_quality_gate.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## 不允许执行的动作

```text
- 真实 VCPChat / VCPToolBox 读取（需 A5 授权包）
- 真实插件调用（需 A5 授权包）
- 真实 API / DailyNote / VCP memory 操作（需 A5 授权包）
- 图片文件创建（需 A5 授权包）
- push / tag / release / PR / deploy（需独立授权）
- 新增依赖（需独立授权）
- localStorage / sessionStorage / IndexedDB / fs / fetch / XMLHttpRequest / child_process
- 读取真实 PluginDir / plugin-manifest.json
```

## 六大模块职责

| 模块 | 职责 | 文件 |
|---|---|---|
| Task Panel | 视觉任务管理 | `app.js` / `index.html` — v6TaskPanel |
| Asset Index | 资产索引编辑 | `app.js` / `index.html` — v6AssetIndex |
| Session Store | 会话导入导出 | `app.js` / `index.html` — v6SessionStore |
| Memory Queue | 记忆草案排队 | `app.js` / `index.html` — v6MemoryQueue |
| Plugin Dashboard | 插件调度草案 | `app.js` / `index.html` — v6PluginDashboard |
| Release Panel | 发布准备状态 | `app.js` / `index.html` — v6ReleasePanel |

## 如何判断可以 push

1. `validate_mvp.ps1` 通过
2. `validate-agent-image-lab-local.ps1` 无 FAIL pattern
3. git working tree clean
4. 所有 v6 validators 通过
5. `runtime_prototype_suite.js` 通过
6. 用户明确授权 push

## 如何判断必须 BLOCKED

1. validate_mvp.ps1 失败且无法安全修复
2. 需要真实 PluginDir / VCPChat / VCPToolBox
3. 需要调用插件/API/DailyNote/VCP memory/image
4. 需要 push/tag/release/PR/deploy
5. 需要新增依赖
6. 需要放宽 runtime_guard
7. 工作树出现无关用户改动
8. 出现 secret/token/cookie/private path

## 下一阶段建议

```text
1. v6.9A Release Panel Draft Surface — 已实现
2. v6.9B Release Guard — 已实现
3. v6.10 RC Matrix — 已实现
4. Push v6 全链到远端
5. v7 Real Production Expansion（需 A5 授权包）
```
