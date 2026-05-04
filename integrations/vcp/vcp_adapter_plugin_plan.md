# AgentImageLabAdapter 插件计划

## 定位

AgentImageLabAdapter 是未来的 VCP 轻量桥接插件草案。MVP 阶段只设计 dry-run，不允许 execution mode，不允许真实调用任何 VCP 生图插件。

## 职责

- 接收 `vcp_task_envelope`。
- 做字段存在性和安全边界检查。
- 读取占位能力矩阵。
- 返回 `vcp_dispatch_plan` dry-run 草案。
- 标记 `external_api_allowed=false`。
- 标记 `execution_blocked=true`。
- 将风险交给 `Gatekeeper_Agent` 和 Review Console。

## 非职责

- 不做审美判断。
- 不直接写 VCP 记忆。
- 不绕过 Gatekeeper。
- 不直接调用任意 VCP 插件。
- 不生成图片。
- 不写图片文件。
- 不读取或写入密钥。

## 唯一允许命令

```text
dry_run
```

## 禁止命令

```text
execute
generate
run
call_plugin
write_memory
```

## dry-run 输入

```yaml
task_id: task-photo-studio-os-001
project: Photo Studio OS
task_type: photo_studio_os_review
mode: dry_run
prompt_package_ref: prompt-package-photo-studio-os-001
max_plugin_calls: 0
```

上述值均为假数据或占位字段，不代表真实执行。

## dry-run 输出

```yaml
dispatch_id: dispatch-photo-studio-os-001
task_id: task-photo-studio-os-001
mode: dry_run
selected_plugin: null
fallback_plugins: []
capability_matrix_status: placeholder
reason_cn: "MVP 阶段不选择真实插件，只返回 dry-run 调度草案。"
dry_run_required: true
approval_required: true
risk_level: medium
expected_outputs: 0
max_outputs: 0
overwrite_allowed: false
external_api_allowed: false
execution_blocked: true
gatekeeper_required: true
review_console_required: true
allow_file_write: false
allow_image_binary: false
max_plugin_calls: 0
```

## 安全检查

- 拒绝包含 API key、token、cookie、密码的输入。
- 拒绝包含私密路径的输入。
- 拒绝包含客户隐私的输入。
- 拒绝图片二进制。
- 拒绝真实插件执行参数。

## Phase 4 契约缺口审查

当前 dry-run 契约已具备：

- `mode=dry_run`
- `max_plugin_calls=0`
- `external_api_allowed=false`
- `execution_blocked=true`
- `allow_file_write=false`
- `allow_image_binary=false`
- `selected_plugin=null`
- `expected_outputs=0`
- `max_outputs=0`

Phase 4 需要补硬的交接信息：

- Adapter preflight 结论必须能交给 `Gatekeeper_Agent`。
- Gatekeeper 风险结论必须能交给 Review Console。
- Review Console 只能批准草案，不能触发真实插件执行。
- dry-run rollback 必须定义为“丢弃草案 / 回到上一份草案”，不能定义为撤销真实外部动作。
- 审计记录只能保存脱敏中文摘要，不保存敏感原文。

## Phase 4 dry-run preflight 流程

1. 接收 `vcp_task_envelope` 草案。
2. 校验 `mode` 必须是 `dry_run`。
3. 校验 `dry_run_controls.max_plugin_calls` 必须为 `0`。
4. 校验 `dry_run_controls.allow_external_api` 必须为 `false`。
5. 校验 `dry_run_controls.allow_file_write` 必须为 `false`。
6. 校验 `dry_run_controls.allow_image_binary` 必须为 `false`。
7. 校验 `safety.contains_secret`、`safety.contains_private_path`、`safety.contains_customer_private_data` 必须为 `false`。
8. 读取能力矩阵时只允许读取占位状态，不选择真实插件。
9. 返回 `vcp_dispatch_plan` dry-run 草案。
10. 将 `gatekeeper_required=true`、`review_console_required=true` 写入返回草案。

如果任一检查失败，Adapter 只能返回 rejected dry-run 草案和中文脱敏原因，不得执行任何外部动作。

## Gatekeeper 与 Review Console 交接

Adapter dry-run 输出之后：

```text
vcp_task_envelope
→ AgentImageLabAdapter dry-run preflight
→ vcp_dispatch_plan
→ Gatekeeper_Agent 风险复查
→ Review Console 人工审批展示
→ memory_delta 草案
```

交接规则：

- Gatekeeper 只审核执行风险、安全风险和越界风险，不做审美判断。
- Review Console 只展示风险结论、人工评分和记忆预览，不触发执行。
- `memory_approval.status=approved` 只代表允许生成写入申请，不代表已写入 DailyNote。
- `archive_decision.asset_status=accepted` 必须来自人工批准，不能来自 AI 建议。

## 未来单插件接入前置条件

Phase 4 不选择真实插件，不推测插件能力。未来若进入单插件真实接入，必须先满足：

1. 人工确认读取的是真实 VCPToolBox 插件 manifest。
2. 能力矩阵从 `待实测` 进入 `pending_manifest_review`，再由人工测试决定是否 `tested`。
3. 插件 manifest 不包含要写入文档的密钥、token、cookie、密码、私密路径或客户隐私。
4. Gatekeeper 完成 dry-run 风险结论。
5. Review Console 完成人工审批。
6. 有明确 rollback 方案。
7. 有执行审计字段。
8. 用户另行明确批准从 dry-run 进入真实执行。

## rollback / audit / no-execution 矩阵

| 项目 | Phase 4 定义 | 必须保持 |
|---|---|---|
| rollback | 丢弃当前 dry-run 草案，回到上一份草案 | 不撤销任何真实外部动作 |
| audit | 记录中文脱敏摘要、task_id、dispatch_id、审批状态 | 不记录敏感原文 |
| plugin call | 真实调用次数为 0 | `max_plugin_calls=0` |
| API | 不允许外部 API | `external_api_allowed=false` |
| file write | 不允许写文件或图片 | `allow_file_write=false`、`allow_image_binary=false` |
| memory write | 不直接写 DailyNote 或 VCP 长期记忆 | 只生成 `memory_delta` 草案 |

## 后续真实插件前提

真实插件执行不属于 MVP-A。若未来进入 MVP-B 或后续阶段，必须另开任务，并经人工确认插件 manifest、能力矩阵、审批动作、回滚路径和执行审计。
