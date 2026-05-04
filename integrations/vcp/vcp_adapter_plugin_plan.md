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
selected_plugin: null
fallback_plugins: []
reason_cn: "MVP 阶段不选择真实插件，只返回 dry-run 调度草案。"
dry_run_required: true
approval_required: true
risk_level: medium
expected_outputs: 0
max_outputs: 0
overwrite_allowed: false
external_api_allowed: false
execution_blocked: true
```

## 安全检查

- 拒绝包含 API key、token、cookie、密码的输入。
- 拒绝包含私密路径的输入。
- 拒绝包含客户隐私的输入。
- 拒绝图片二进制。
- 拒绝真实插件执行参数。

## 后续真实插件前提

真实插件执行不属于 MVP-A。若未来进入 MVP-B 或后续阶段，必须另开任务，并经人工确认插件 manifest、能力矩阵、审批动作、回滚路径和执行审计。
