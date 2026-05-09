# v7.12 Runner ModelOverride Preflight

## 结论

runner `scripts/run_v0_7_photo_studio_os_real_execution.ps1` **完全支持** `-ModelOverride`。

## 调用链

```text
-ModelOverride doubao-seedream-5-0-260128
  → line 220: $payload.model = "doubao-seedream-5-0-260128"
  → 写入 JSON payload，传递给 DoubaoGen
  → 插件使用指定模型生成
```

## 第一次运行失败原因

第一次 A5 未传入 `-ModelOverride`，runner 默认使用 `<config-default>`。
config.env 虽设置了 `SEEDREAM_MODEL_ID=doubao-seedream-5-0-260128`，
但 runner 的 Load-EnvFile 未将此环境变量传递给插件进程。
因此插件用自己的默认值 `doubao-seedream-3-0-t2i-250415`。

## 第二次 A5 方案

```powershell
-ModelOverride doubao-seedream-5-0-260128
```
