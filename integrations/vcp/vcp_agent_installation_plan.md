# VCP Agent 安装计划

## 目的

本文只说明未来如何把 Agent Image Lab 的主 Agent 同步到 VCPToolBox。当前阶段不要实际修改 VCPToolBox。

## 当前源文件

```text
agents/imagelab_master.md
```

## 未来同步目标

```text
VCPToolBox/Agent/ImageLab/ImageLab_Master.md
```

## 导出草案位置

```text
exports/vcptoolbox/Agent/ImageLab/ImageLab_Master.md
```

该文件只是草案占位，不代表已经安装到真实 VCPToolBox。

## 未来 agent_map.json 变更示例

```json
{
  "ImageLab_Master": "ImageLab/ImageLab_Master.md"
}
```

对应导出草案：

```text
exports/vcptoolbox/agent_map.patch.example.json
```

## 安装前检查

- ImageLab_Master 明确是 MVP 阶段唯一正式 VCP Agent 候选。
- 子 Agent 仍是岗位流程，不全部注册为正式 VCP Agent。
- DailyNote 中文规则已经写入。
- `memory_delta` 草案和审批规则已经写入。
- Review Console 审批边界已经写入。
- Gatekeeper dry-run 边界已经写入。

## 禁止

- 不要实际修改 VCPToolBox。
- 不要在 MVP-A 注册真实 VCP Agent。
- 不要改动真实 `agent_map.json`。
- 不要改动真实插件 manifest。
- 不要写真实执行代码。
- 不要写密钥、token、cookie、密码、私密路径或客户隐私。

## 未来人工步骤草案

1. 人工复查 `agents/imagelab_master.md`。
2. 人工复查导出草案 `exports/vcptoolbox/Agent/ImageLab/ImageLab_Master.md`。
3. 人工确认是否进入真实 VCPToolBox 同步任务。
4. 在独立任务中复制文件并更新真实 `agent_map.json`。
5. 执行回滚记录和安装审计。
