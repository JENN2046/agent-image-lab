# v7.47 Human Review Checklist — French Summer Rattan Bag v3

## 用途

本文提供生产图人工审片的标准化检查清单。每次生成后必须逐项检查，并记录 asset_status。

## Core Gates

| 检查项 | pass / fail | 备注 |
|--------|-------------|------|
| `prompt_subject_match` | | 藤编包是否为主体，无主体偏移 |
| `product_fully_visible` | | 包身完整可见，无裁切 |
| `product_unobstructed` | | 包身未被道具/文字/装饰物遮挡 |
| `rattan_texture_visible` | | 藤编纹理清晰可辨 |
| `bicycle_rear_rack_visible` | | 自行车后架可见 |
| `partial_rear_wheel_visible` | | 自行车后轮部分可见 |
| `no_readable_book_text` | | 书本文字不可读 |
| `no_watermark_or_generated_mark` | | 无水印或生成标记 |
| `clean_image_corners` | | 四角干净，无异常侵入 |
| `commercial_usability` | | 整体符合商用交付标准 |

## V3 Support-Logic Gates

| 检查项 | pass / fail | 备注 |
|--------|-------------|------|
| `lower_left_props_physically_supported` | | 左下角道具均有物理承托面 |
| `orange_has_visible_support_surface` | | 橙子有可见支撑面 |
| `keys_have_clear_anchor_point` | | 钥匙有清晰挂点 |
| `red_knit_has_contact_shadow` | | 红色针织物有接触阴影 |
| `no_floating_or_edge_stuck_props` | | 无悬浮或贴边道具 |
| `support_logic_believable_under_real_gravity` | | 整体支撑逻辑符合真实重力 |

## Known Minor Issues（不构成拒收，但需记录）

- `red_knit_area_may_still_become_visually_strong`
- `bag_floral_or_lace_like_decoration_may_become_more_decorative_than_plain_rattan_reference`
- `rose_plastic_wrap_may_still_feel_studio_styled`
- `right_bicycle_saddle_or_rear_light_edge_may_intrude_occasionally`
- `prop_density_can_still_drift_toward_staged_composition`

## Asset Status

审片完成后，必须从以下四种状态中选择一项：

- **accepted_candidate** — 全部 core gates + support-logic gates 通过，可以交付
- **accepted_with_minor_warning** — 全部 gate 通过，但存在已知 minor issue 需记录
- **rejected** — 存在不可接受的问题（主体缺失、水印、遮挡、文字可读等）
- **needs_retry_new_a5_required** — 需重试，但必须申请新的 A5 授权

## 审片记录模板

```yaml
human_review:
  asset_status: "<accepted_candidate | accepted_with_minor_warning | rejected | needs_retry_new_a5_required>"
  core_gates:
    prompt_subject_match: pass
    product_fully_visible: pass
    product_unobstructed: pass
    rattan_texture_visible: pass
    bicycle_rear_rack_visible: pass
    partial_rear_wheel_visible: pass
    no_readable_book_text: pass
    no_watermark_or_generated_mark: pass
    clean_image_corners: pass
    commercial_usability: pass
  v3_support_logic_gates:
    lower_left_props_physically_supported: pass
    orange_has_visible_support_surface: pass
    keys_have_clear_anchor_point: pass
    red_knit_has_contact_shadow: pass
    no_floating_or_edge_stuck_props: pass
    support_logic_believable_under_real_gravity: pass
  known_minor_issues_observed:
    - red_knit_area_may_still_become_visually_strong
  reviewer_notes: ""
```

## 边界

- 审片记录只提交文本，不包含图片二进制。
- asset_status 为 `rejected` 或 `needs_retry_new_a5_required` 时，必须写 reviewer_notes 说明原因。
- 审片通过后仍不自动授权 push / memory write / daily note write。
