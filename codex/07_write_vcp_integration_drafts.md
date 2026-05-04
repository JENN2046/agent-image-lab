# Codex Task 07 — Write VCP Integration Drafts

## 目标

补齐 VCP 接入草案，包括 Agent 安装计划、Adapter dry-run 设计、插件能力矩阵和工具请求示例。

## 工作范围

只允许修改项目根目录下：

```text
integrations/vcp/
exports/
```

不得修改 `codex/00_MASTER_TASK.md`、VCPToolBox 或 VCPChat。

## 必须说明

- `agents/imagelab_master.md` 未来可同步为 `VCPToolBox/Agent/ImageLab/ImageLab_Master.md`。
- 未来 `agent_map.json` 可增加 `"ImageLab_Master": "ImageLab/ImageLab_Master.md"`。
- 当前阶段不要实际修改 VCPToolBox。
- Adapter 只做桥接。
- Adapter 先 dry-run。
- Adapter 不做审美。
- Adapter 不直接写记忆。
- Adapter 不绕过 Gatekeeper。

## 插件矩阵要求

只写占位行，不猜测真实插件能力。真实能力必须来自本地 manifest 和测试结果。

## 工具请求示例要求

必须标注：示例仅用于格式说明，不代表真实执行，不含真实插件调用，不含密钥。

## Definition of Done

VCP 接入路径清晰，但没有任何真实插件执行代码或主仓修改。
