# v7.16 Native Doubao Real API Activation Preflight

## 目的

为 Native Doubao Image Plugin 接入真实豆包 API 前做预检。

## 当前基线

```text
commit: 6528d6d
```

## 当前插件状态

| 组件 | 路径 |
|------|------|
| Profile | `plugins/image_generation/native_doubao_image/plugin.profile.yaml` |
| JS Plugin | `plugins/image_generation/native_doubao_image/native_doubao_image.js` |
| Adapter | `adapters/image_generation/native_doubao_adapter.js` |
| Config | `plugins/image_generation/native_doubao_image/config.example.yaml` |
| 当前状态 | dry-run contract only |

## 预检要求

```text
- required model: doubao-seedream-5-0-260128
- API key 只允许来自环境变量 DOUBAO_IMAGE_API_KEY
- base_url 只允许来自 config 或环境变量，不得写死 secret
- 不允许把 API key/token/cookie 写入仓库
- 请求必须来自 prompt_package_ref
- prompt_package_ref 必须位于 prompts/image_generation/
- 输出必须位于 runs/real_generation/
- max_plugin_calls=1
- max_images_created=1
- retry_allowed=false
- memory_write_allowed=false
- daily_note_write_allowed=false
- 真实执行仍需单独 A5 activation
- 本文档不授权真实 API 调用
- 若 model_reported != model_requested，必须 BLOCKED_MODEL_MISMATCH
```
