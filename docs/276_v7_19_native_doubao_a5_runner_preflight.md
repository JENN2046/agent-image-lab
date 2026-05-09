# v7.19 Native Doubao A5 Runner Preflight

## 目的

创建 Native Doubao 的 runner/CLI 入口，支持 preflight 和 dry-run。

## 新增文件

| 文件 | 用途 |
|------|------|
| `scripts/run_native_doubao_image_generation.js` | runner CLI，默认 dry-run |
| `docs/276` | 本文档 |

## Runner 功能

- 读取 `.env.local` 字段名（不输出真实值）
- 调用 `adapters/image_generation/native_doubao_adapter.js`
- 支持 CLI 参数：`--prompt-package-ref`, `--output-directory`, `--model` 等
- 默认 `--dry-run=true`
- `--dry-run=false` 且 `--execution-authorized=true` 且 `--a5-activation-ref` 存在时才可执行真实 API

## 边界

- 不输出 API key
- 不执行真实 HTTP 请求（dry-run 模式）
- 不创建图片
- 不 push/tag/release
