# v7.49 VCP Case Summary Schema

## 1. Purpose

定义未来 case_summary YAML schema，用于收束评审记录为结构化摘要，供 VCP memory 写入前确认。

## 2. Schema

```yaml
case_summary:
  case_id: "<string>"
  case_title: "<string>"
  product_line: "<string>"
  prompt_package_id: "<string>"
  prompt_package_ref: "<path>"
  production_readiness: "<candidate_ready_with_manual_visual_review | production_approved | rejected>"
  stability_status: "<stable_candidate | stable_candidate_needs_manual_review | unstable>"
  source_reviews:
    - phase: "<string>"
      asset_status: "<string>"
      review_ref: "<path>"
  final_asset:
    image_ref: "<path>"
    image_hash: "<sha256 | pending | not_available>"
    asset_status: "<string>"
  known_minor_issues:
    - "<string>"
  memory_delta_candidate:
    allowed: <true | false>
    requires_new_a5: <true | false>
  forbidden_payloads:
    - image_binary
    - raw_request
    - raw_response
    - api_key
    - token
    - private_path
  next_action: "<string>"
```

## 3. Example — French Summer Rattan Bag v3

```yaml
case_summary:
  case_id: "french_summer_rattan_bag_v3"
  case_title: "French Summer Rattan Bucket Bag — Product Still Life v3"
  product_line: "french_summer_rattan_bag"
  prompt_package_id: "product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3"
  prompt_package_ref: "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml"
  production_readiness: "candidate_ready_with_manual_visual_review"
  stability_status: "stable_candidate"
  source_reviews:
    - phase: "v7.41"
      asset_status: "accepted_candidate"
      review_ref: "stability_tests/reviews/v7_41_v3_dry_run_shot_1_post_run_review.md"
    - phase: "v7.42"
      asset_status: "accepted_candidate"
      review_ref: "stability_tests/reviews/v7_42_v3_dry_run_shot_2_post_run_review.md"
    - phase: "v7.43"
      asset_status: "accepted_candidate"
      review_ref: "stability_tests/reviews/v7_43_v3_dry_run_shot_3_post_run_review.md"
  final_asset:
    image_ref: "runs/real_generation/v7_43_french_summer_rattan_bag_v3_dry_run_shot_3/native_doubao_1778339914744_0.jpg"
    image_hash: "not_available"
    asset_status: "accepted_candidate"
  known_minor_issues:
    - "red knit area may still become visually strong"
    - "bag floral/lace-like decoration may become more decorative than plain rattan reference"
    - "rose plastic wrap may still feel studio-styled"
    - "right bicycle saddle or rear light edge may intrude occasionally"
    - "prop density can still drift toward staged composition"
  memory_delta_candidate:
    allowed: false
    requires_new_a5: true
  forbidden_payloads:
    - image_binary
    - raw_request
    - raw_response
    - api_key
    - token
    - private_path
  next_action: "wait_for_real_production_need_or_create_v7_51_production_candidate_plan"
```

## 4. Usage Notes

- 示例中的 `image_hash` 为 `not_available`，因为 dry-run 资产未计算正式 hash。
- 真实 production candidate 产生后应更新 `image_hash` 为实际 sha256。
- `memory_delta_candidate.allowed` 在当前阶段为 `false`，需独立 A5 授权后才能设为 `true`。
