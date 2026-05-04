# VCP 集成总览

## 目的

本文描述 Agent Image Lab v0.2 未来如何接入 VCP 生态。当前阶段只写文档、schema、导出草案和 dry-run 设计，不修改真实 VCPToolBox，不修改真实 VCPChat，不调用任何 VCP 生图插件。

## 三个未来接入点

| 接入点 | 未来目标 | 当前状态 | 边界 |
|---|---|---|---|
| VCPToolBox Agent | `VCPToolBox/Agent/ImageLab/ImageLab_Master.md` | 只写安装计划和导出草案 | 不实际复制，不注册真实 Agent |
| VCPToolBox Plugin | `VCPToolBox/Plugin/AgentImageLabAdapter/` | 只写 Adapter dry-run 草案 | 不写执行代码，不调用插件 |
| VCPChat | `VCPChat/ImageLabmodules/` | 只写 Review Console 规格 | 不实现 UI，不改 VCPChat |

## MVP-A 边界

- `external_api_allowed=false`
- `execution_blocked=true`
- `max_plugin_calls=0`
- Adapter 只能返回 dry-run 计划。
- Review Console 只做人工评分、审批和记忆预览规格。
- DailyNote 写入只生成中文草案，不执行真实写入。

## 数据流草案

```text
task_envelope
→ ImageLab_Master
→ AgentImageLabAdapter dry-run
→ vcp_dispatch_plan
→ Gatekeeper_Agent 风险检查
→ Review Console 人工审批
→ memory_delta 草案
```

## 禁止事项

- 不修改真实 VCPToolBox 主仓。
- 不修改真实 VCPChat 主仓。
- 不创建真实插件执行逻辑。
- 不调用任何 VCP 生图插件。
- 不推测具体插件能力。
- 不写 API key、token、cookie、密码、私密路径或客户隐私。
- 不把 dry-run 示例当作真实执行记录。

## 后续进入真实集成的前提

真实集成必须另开任务，并先完成：

- 读取真实 VCPToolBox 插件 manifest。
- 运行人工批准的 dry-run 测试。
- 建立回滚路径。
- 建立执行审计。
- 明确 Review Console 审批动作。
- 明确 DailyNote 中文写入审批。
