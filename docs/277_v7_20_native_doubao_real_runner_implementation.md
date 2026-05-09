# v7.20 Native Doubao Real Runner Implementation

## 修改内容

1. **runner** — 新增 `loadEnvLocal()`，从 `.env.local` 加载到 `process.env`（不打印值）
2. **plugin** — `realGenerate` 从 stub 升级为真实 HTTP fetch 实现
3. **plugin** — `writeImageOutput` 从 stub 升级为真实 base64 图片写入
4. **adapter** — `run` 改为 async，支持 await realGenerate

## 安全门

- 默认 `dryRun=true`，不执行 API
- `dryRun=false` 且 `executionAuthorized=true` 且 `a5ActivationRef` 存在时才加载 env
- `validateRealExecutionGate` 在 HTTP 调用前再次检查
- `process.env.DOUBAO_IMAGE_API_KEY` 不存在时 gate 阻断
- model mismatch 自动返回 BLOCKED_MODEL_MISMATCH
