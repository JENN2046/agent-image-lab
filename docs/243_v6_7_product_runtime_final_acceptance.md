# v6.7 Product Runtime Final Acceptance / Baseline

## 目的

把 v6.1～v6.6 收束成一个可验收的 **v6 Product Runtime Baseline**。

这是最终验收、状态收口、基线记录，不是继续堆功能，不是重做 Review Console，不是接真实生产执行。

确认 Agent Image Lab v6 产品运行台主体已经成形，并给它盖上第一枚钢印。

## 当前基线

```text
commit: dd5d7b5
message: chore: add v6.6 product shell QA and visual polish
branch: master
date: 2026-05-09
```

## v6.1～v6.6 完成矩阵

| Version | Module | Status | Validator | Boundary |
|---|---|---|---|---|
| v6.1 | Task Panel | complete | validate_v6_1_task_panel_interaction.js | no-execution |
| v6.2 | Asset Index | complete | validate_v6_2_asset_index_interaction.js | no file read / no binary |
| v6.3 | Session Store | complete | validate_v6_3_session_store_interaction.js | no disk write / no raw payload |
| v6.4 | Memory Queue | complete | validate_v6_4_memory_queue_interaction.js | no DailyNote / no VCP memory write |
| v6.5 | Product Shell | complete | validate_v6_5_review_console_product_shell.js | no production integration |
| v6.6 | Product Shell QA | complete | validate_v6_6_product_shell_qa.js | visual polish only |

## 各模块作用

### v6.1 Task Panel

在 Review Console runtime prototype 中增加任务面板交互表单，包含：
- 视觉目标输入
- 当前阶段选择（draft / planning / in_review / blocked / completed）
- 负责人选择（ImageLab_Master / Prompt_Designer / Gatekeeper / Archivist_Agent / Human）
- 下一步动作输入
- 阻断原因输入
- 关联 Review Session ID 输入
- task_id / stage / owner / guard 只读输出

所有值仅存于 draft surface，不执行 API 调用、不写磁盘。

### v6.2 Asset Index

将 Asset Index 从只读展示扩展为可本地编辑、筛选的 draft-only 资产索引面板：
- asset_ref / asset_hash / asset_status 编辑
- status 过滤（all / accepted_candidate / needs_human_review / rejected / memory_suitable）
- 条目计数
- no-execution 边界：不写磁盘、不存储 raw 路径、不创建图片二进制

### v6.3 Session Store

实现会话草案管理面板：
- current_session 展示
- linked_task_id / linked_asset_refs 输入
- import_preview 五状态选择
- restore_candidate 切换
- session_list 草案显示
- 闭合 Task / Asset / Session 三角形底座
- 不写磁盘、不存储 raw payload

### v6.4 Memory Queue

实现记忆草案队列交互层：
- approval_status 切换（pending / approved / rejected / blocked）
- reviewer_role 选择
- should_write_to_vcp 意图标记
- block_reason_cn / reject_reason_cn 中文原因输入
- 队列计数
- 不调用 DailyNote、不写 VCP memory

### v6.5 Review Console Product Shell

将 Review Console 从长页面原型升级为产品级审片驾驶舱：
- 左侧导航：7 个入口（评审台、候选队列、授权与记忆、交付归档、追踪矩阵、会话续航、系统设置）
- 顶部流程条：7 个步骤（候选→人工评审→风险复核→记忆申请→授权前复核→交付包→归档）
- 中央审片区：评审头、人工评审、记忆预览、草案视图、v6 Product Runtime
- 右侧裁决栏：最终裁决、决策摘要、记忆队列状态、写入边界、评审前检查、主程序回执
- 底部操作区：候选队列、批量交接摘要、Human Override 追踪矩阵
- 不接真实生产集成、不调用插件/API

### v6.6 Product Shell QA + Visual Polish

在 v6.5 基础上进行质量复查和视觉优化：
- 五大区域 DOM 结构完整性确认
- 右侧裁决栏数据投射验证（final verdict、score band、memory status、write_authorized/false、write_performed/false 均从已有 draft 数据投射）
- CSS 视觉优化：右侧栏可读性、导航 active 状态、顶部流程条语义状态（completed/risk/blocked）、卡片层级、颜色语义、响应式断点
- 所有 v6.0-v6.5 validator 兼容
- 不新增业务模块、不重构 Review Console、不接真实生产执行

## Validator 清单

```text
scripts/validate_v6_0_product_runtime_kickoff.js       — 10 checks
scripts/validate_v6_1_task_panel_interaction.js         — 9 checks
scripts/validate_v6_2_asset_index_interaction.js        — 16 checks
scripts/validate_v6_3_session_store_interaction.js      — 16 checks
scripts/validate_v6_4_memory_queue_interaction.js       — 25 checks
scripts/validate_v6_5_review_console_product_shell.js   — 18 checks
scripts/validate_v6_6_product_shell_qa.js               — 25 checks
scripts/validate_v6_7_product_runtime_final_acceptance.js — 33 checks
```

## 当前仍禁止的动作

```text
- 新增 v6.8 功能（如 Plugin Dashboard、Release Panel）
- 修改 Review Console 业务逻辑
- 修改 runtime_guard 规则
- 使用 localStorage / sessionStorage / IndexedDB
- 使用 fs / fetch / XMLHttpRequest / child_process
- 读取真实 VCPChat / VCPToolBox 数据
- 调用插件或 API
- 调用 DailyNote
- 写 VCP memory
- 创建图片
- 读取真实文件系统数据
- 新增依赖
- push / tag / release / PR
- A5 生产执行（无 active authorization package）
```

## no-execution 边界确认

所有 v6 runtime 模块保持：
- `api_called: false`
- `daily_note_called: false`
- `vcp_plugin_called: false`
- `disk_write_performed: false`
- `image_file_created: false`
- `write_authorized: false`
- `write_performed: false`

## v6 Product Runtime Baseline 验收结论

```text
STATUS: ACCEPTED — v6 Product Runtime Baseline

v6.1 Task Panel、v6.2 Asset Index、v6.3 Session Store、v6.4 Memory Queue、
v6.5 Review Console Product Shell、v6.6 Product Shell QA 六段已全部完成。

- 6 个模块 + 1 轮 QA = 7 个 v6 里程碑
- 7 个 validator = 119 项检查全部通过
- runtime prototype 验证套件（语法检查、guard unit、smoke test、delivery surface）全部通过
- MVP 全套验证通过
- 所有模块保持 draft_only / no-execution 边界
- 无真实 VCPChat/VCPToolBox 读取
- 无插件/API/DailyNote/VCP memory/图片动作
- git 工作树干净

v6 Product Runtime Baseline 已成形并接受为可交付基线。
```

## 后续建议

### 推荐：v6.8 Plugin Dashboard

在 Review Console 中增加插件调度面板（plugin dispatch selection、参数映射、dry-run 切换、状态追踪）。
需保持 no-execution 边界，不调用真实插件。

### 备选：v7 Real Production Expansion

在已有 v6 Product Runtime Baseline 基础上，通过新 A5 授权包进行真实生产扩展。
需明确的生产执行授权和 plugin/API/DailyNote 使用范围。
