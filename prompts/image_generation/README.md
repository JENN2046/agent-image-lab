# prompts/image_generation/

成品提示词包。每个 YAML 文件是一个完整的提示词包，包含 prompt、negative_prompt、safety 规则和 execution 参数。

通过 `prompt_package_ref` 被 A5 激活模板引用（`docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md`）。

## 包列表

| 文件 | prompt_package_id | 说明 |
|------|-------------------|------|
| `product_still_life_outdoor_tennis_v1.yaml` | `product_still_life_outdoor_tennis_v1` | 户外网球静物商业摄影 |

## 规则

- 所有提示词包 `reference_policy` 必须是 `text_only_no_image_input`
- 禁止 image-to-image
- 必须包含 `safety` 字段
- 必须包含 `execution` 字段（model、size）
