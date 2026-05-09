# v7.14 DoubaoGen Model Lock Enforcement

## Root Cause

DoubaoGen 的 `generate` 命令有自动模型降级机制（`callAPI` 函数，最大 3 次 fallback）。
当请求的模型（doubao-seedream-5-0-260128）返回 HTTP 400 时，插件自动降级到可用模型。

```text
runner 传入 payload.model = doubao-seedream-5-0-260128 ✅
插件读取 requestBody.model = doubao-seedream-5-0-260128 ✅
API 返回 400（模型不可用/无效）
插件自动降级到 doubao-seedream-3-0-t2i-250415 ❌
```

## 修复

在 runner `scripts/run_v0_7_photo_studio_os_real_execution.ps1` 中增加硬拦截：

```text
plugin_reported_model_matches_requested == false 时：
- status → blocked_model_mismatch
- asset_status → blocked
- memory_write_allowed → false
- daily_note_write_allowed → false
```

## 不修改项

- 不修改 DoubaoGen 插件本体
- 不修改 VCPToolBox
- 不修改 config.env
