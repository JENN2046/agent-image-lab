# v7.45 Production Usage SOP — French Summer Rattan Bag v3

## 用途

本文定义 v3 prompt package 在生产环境中的使用范围、禁止行为和每次生产必须遵守的操作规范。

## Allowed Use

- `single_image_production_candidate`
- `controlled_product_still_life_generation`
- `human_reviewed_delivery_candidate`

## Not Allowed By Default

- `batch_generation`
- `retry_without_new_a5`
- `automatic_memory_write`
- `automatic_daily_note_write`
- `direct_final_delivery_without_review`

## 每次生产必须

```yaml
one_api_call: true
one_image: true
retry_allowed: false
watermark_false_required: true
human_review_required: true
commit_text_review_only: true
push_requires_separate_authorization: true
```

## 说明

- **one_api_call: true** — 每张生产图只允许 1 次 API 调用。如需重试，必须先申请新的 A5 授权。
- **one_image: true** — 每次调用只生成 1 张图片。不支持批量。
- **retry_allowed: false** — 不允许自动重试。生成失败或拒收后，需人工决策下一步。
- **watermark_false_required: true** — API 请求中必须显式设置 `watermark: false`，并在 payload 中发送该参数。
- **human_review_required: true** — 每次生成后必须进行人工审片，不得自动交付。
- **commit_text_review_only: true** — commit 只允许提交文本评审记录和 metadata，不得提交图片二进制文件。
- **push_requires_separate_authorization: true** — push 操作需要独立授权，commit 本身不授权 push。

## 参考

- Prompt package: `prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml`
- Stability status: `stable_candidate`
- Production readiness: `candidate_ready_with_manual_visual_review`
