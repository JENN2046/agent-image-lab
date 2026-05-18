# v7.46 One-Shot A5 Authorization Template — French Summer Rattan Bag v3

## 用途

本文提供可复制的 A5 授权模板。每次真实生产前，复制此模板并填入实际值，经用户确认后方可执行。

## 模板

```yaml
a5_authorization:
  phase: "<v7_xx>"
  a5_authorization_ref: "<A5-YYYYMMDD-RATTAN-PROD-xxx>"
  prompt_package: "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml"
  model: "doubao-seedream-5-0-260128"
  watermark_requested: false
  watermark_parameter_must_be_sent: true
  api_calls_allowed: 1
  images_allowed: 1
  retry_allowed: false
  batch_generation_allowed: false
  output_directory: "runs/real_generation/<phase>_<description>/"
  stop_after_generation_for_human_review: true
  no_commit_before_review: true
  no_push: true
  no_memory_write: true
  no_daily_note_write: true
```

## 字段说明

| 字段 | 说明 |
|------|------|
| `phase` | 当前阶段编号，如 `v7_48` |
| `a5_authorization_ref` | 唯一授权引用号，格式 `A5-YYYYMMDD-RATTAN-PROD-xxx` |
| `prompt_package` | 固定指向 v3 prompt package，不得使用其他版本 |
| `model` | 固定为 `doubao-seedream-5-0-260128` |
| `watermark_requested` | 固定为 `false` |
| `watermark_parameter_must_be_sent` | 必须为 `true`，必须在 API payload 中发送此参数 |
| `api_calls_allowed` | 固定为 `1` |
| `images_allowed` | 固定为 `1` |
| `retry_allowed` | 固定为 `false` |
| `batch_generation_allowed` | 固定为 `false` |
| `output_directory` | 按 `runs/real_generation/<phase>_<description>/` 格式填写 |
| `stop_after_generation_for_human_review` | 固定为 `true`，生成后必须等待人工审片 |
| `no_commit_before_review` | 固定为 `true`，审片通过前不得 commit |
| `no_push` | 固定为 `true`，需独立授权 |
| `no_memory_write` | 固定为 `true`，需独立授权 |
| `no_daily_note_write` | 固定为 `true`，需独立授权 |

## 执行命令模板

```powershell
node scripts\run_native_doubao_image_generation.js `
  --dry-run=false `
  --execution-authorized=true `
  --a5-activation-ref="<A5-YYYYMMDD-RATTAN-PROD-xxx>" `
  --plugin-profile-ref="plugins/image_generation/native_doubao_image/plugin.profile.yaml" `
  --prompt-package-ref="prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml" `
  --model="doubao-seedream-5-0-260128" `
  --output-directory="runs/real_generation/<phase>_<description>/" `
  --max-plugin-calls=1 `
  --max-images-created=1 `
  --retry-allowed=false
```

## 边界

- 此模板本身不授权任何执行。
- 每次使用前必须复制为独立授权包，经用户确认。
- 本模板只适用于 French Summer Rattan Bag v3 prompt package。
- 其他产品线需各自独立的 A5 模板。
