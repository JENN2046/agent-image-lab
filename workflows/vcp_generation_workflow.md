# VCP 插件生成工作流

## 目标

定义未来如何从 `task_envelope` 生成 `dispatch_plan`，并由 Gatekeeper 保持 dry-run。本工作流不触发真实插件，不调用外部 API。

## 输入

- `task_envelope`
- `prompt_package`
- VCP 插件能力矩阵占位。
- 插件表现记忆摘要。
- 人工审批状态。

## 流程

```text
task_envelope
→ VCP_Dispatcher_Agent 读取插件能力矩阵
→ 生成 dispatch_plan
→ Gatekeeper_Agent 检查 dry_run_required=true
→ Gatekeeper_Agent 设置 external_api_allowed=false
→ Gatekeeper_Agent 设置 execution_blocked=true
→ Review Console 展示风险和审批需求
→ 输出 Execution_Audit_Log 类 memory_delta 草案
```

## 输出

- `dispatch_plan`
- `execution_gate_report`
- 风险等级。
- 审批需求。
- 执行审计类 `memory_delta`

## 使用的 Agent

- `VCP_Dispatcher_Agent`
- `Gatekeeper_Agent`
- `ImageLab_Master`

## 是否需要 Review Console

true。任何从 dry-run 进入真实执行的未来动作都必须人工审批。

## 是否需要 memory_delta

true。dry-run、风险判断、拒绝执行原因和审批状态都必须形成 `memory_delta`。

## 是否会写 VCP 记忆

false。MVP 阶段只生成 `Execution_Audit_Log` 草案，不写 DailyNote。

## 是否会调用真实插件

false。MVP 阶段必须满足：

```yaml
dry_run_required: true
external_api_allowed: false
execution_blocked: true
max_plugin_calls: 0
```

## 禁止

- 不写真实插件执行代码。
- 不猜测真实插件能力。
- 不写 API key、token、cookie、密码或私密路径。
- 不把 dry-run 示例误写成真实执行记录。

## MVP 验收

- `dispatch_plan` 只说明格式和风险。
- Gatekeeper 明确阻止真实执行。
- `memory_delta` 正文中文。
