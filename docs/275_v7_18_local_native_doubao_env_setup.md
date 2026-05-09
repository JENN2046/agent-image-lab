# v7.18 Local Native Doubao Env Setup

## 目的

建立本机 `.env` 配置方案，用于保存 Native Doubao API 的本机环境变量。

## 规则

- `.env` / `.env.local` 只存在本机，不进入 Git
- `.env.example` / `.env.local.example` 可以入 Git，但不包含真实 key
- `DOUBAO_IMAGE_API_KEY` 只能从本机环境变量或 `.env.local` 读取
- 真实 API 调用仍需 v7.18 A5 activation
- 配置存在不等于授权执行
- 默认 dry-run 仍为 true
- 系统损坏后可用 `.env.local.example` 恢复字段结构，但真实 key 需要用户从安全位置重新填入

## 文件

| 文件 | 入 Git | 用途 |
|------|--------|------|
| `.env.example` | 是 | 占位符模板 |
| `.env.local.example` | 是 | 本地填写模板 |
| `.env` | 否 | 本机实际配置（不提交） |
| `.env.local` | 否 | 本机本地配置（不提交） |
