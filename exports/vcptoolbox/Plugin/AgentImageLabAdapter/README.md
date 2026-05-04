# AgentImageLabAdapter 导出草案

> 本目录是未来 VCPToolBox 插件的导出草案，不是真实安装目录。

## 当前状态

- draft only。
- dry-run only。
- 没有真实执行入口。
- 没有 `index.js`。
- 不调用任何 VCP 生图插件。
- 不写 VCP 记忆。

## 唯一允许命令

```text
dry_run
```

## dry-run 输入

```yaml
task_id: task-photo-studio-os-001
project: Photo Studio OS
task_type: photo_studio_os_review
mode: dry_run
max_plugin_calls: 0
```

以上都是假数据或占位字段，不代表真实执行。

## dry-run 输出

```yaml
selected_plugin: null
dry_run_required: true
approval_required: true
external_api_allowed: false
execution_blocked: true
max_outputs: 0
```

## 禁止

- 不创建真实插件执行逻辑。
- 不调用 VCP 生图插件。
- 不写图片文件。
- 不写 DailyNote。
- 不写 API key、token、cookie、密码、私密路径或客户隐私。
- 不根据猜测填写真实插件能力。

## 未来安装前提

必须另开真实集成任务，并经过人工确认：manifest、执行入口、回滚方案、Gatekeeper 审计、Review Console 审批和记忆写入边界。
