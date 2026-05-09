# v7.17 Native Doubao Real API Implementation Draft

## 目的

在 Native Doubao Image Plugin 中补齐真实豆包 API 调用实现草案。

## 重要声明

- v7.17 是真实 API 实现草案，不是 A5 激活
- 默认 dry_run=true
- 真实调用必须满足 A5 activation
- API key 只来自 DOUBAO_IMAGE_API_KEY 环境变量
- 不读取、不输出、不提交真实 API key
- model 必须锁定 doubao-seedream-5-0-260128
- model mismatch 必须 blocked
- 图片输出只允许 runs/real_generation/
- memory / DailyNote 默认禁止

## 新增函数

| 函数 | 用途 |
|------|------|
| `validateRealExecutionGate` | 检查 A5 激活条件是否满足 |
| `buildDoubaoRequest` | 构建豆包 API 请求体（provider-specific 集中处） |
| `realGenerate` | 真实 API 调用入口（当前为 stub，不执行 HTTP） |
| `writeImageOutput` | 图片写入（当前仅校验路径，不写入文件） |

## Gate 阻断条件

以下任一条件不满足时 realGenerate 返回 BLOCKED：

- dryRun !== false
- executionAuthorized !== true
- a5ActivationRef 不存在
- apiKeyEnv !== DOUBAO_IMAGE_API_KEY
- process.env.DOUBAO_IMAGE_API_KEY 不存在
- maxPluginCalls > 1
- maxImagesCreated > 1
- retryAllowed === true

## 下一阶段

v7.18 A5 real API activation（需用户提供真实环境变量并授权）
