# v7.15 Native Doubao Image Plugin

## 为什么做

摆脱对 VCPToolBox / DoubaoGen 插件目录的依赖。Agent Image Lab 拥有自己的生图插件层。

## 与 VCP DoubaoGen 的区别

| | VCP DoubaoGen | Native Doubao Image Plugin |
|---|---|---|
| 依赖 | VCPToolBox | 无 |
| 模型锁定 | 有自动降级（不可控） | block_on_model_mismatch=true |
| 配置 | config.env + PluginDir | config.example.yaml + env var |
| 调用方式 | PowerShell runner | Node.js adapter |
| 当前状态 | 可用 | dry-run contract only |

## 架构

```text
prompts/image_generation/xxx.yaml
  → native_doubao_image.js (loadPromptPackage)
  → buildRequestPayload → dryRunGenerate
  → native_doubao_adapter.js (统一入口)
  → 输出 DRY_RUN_ONLY 结果
```

## 当前版本

只支持 dry-run contract。真实 API 调用必须等后续 A5 授权。

## 安全规则

- API key 只能来自环境变量 `DOUBAO_IMAGE_API_KEY`，不得写入仓库
- 模型必须锁定 `doubao-seedream-5-0-260128`
- model mismatch 必须 blocked
- 所有 safety 字段保持 false
