# v10.6 A5 Prompt Failure Analysis And Safer Strategy

本文记录 Agent Image Lab v10.6 A5 prompt failure analysis and safer strategy。v10.4 / v10.5 已经各执行一次授权内 DoubaoGen 真实生图，两个资产均被拒收。本阶段不调用插件、不调用 API、不写 DailyNote、不写 VCP memory、不创建图片，只把失败原因和下一版更安全的 prompt 策略固定为可验证交付物。

```yaml
status: completed_validated_v10_6_a5_prompt_failure_analysis_and_safer_strategy
version: v10.6
current_phase: "v10.6 A5 prompt failure analysis and safer strategy"
validation_file: scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js
previous_phase: "v10.5 A5 DoubaoGen no-text retry rejected asset record"
previous_record: docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md
default_next_phase: "BLOCKED for user review of safer prompt before any new real generation"
```

## Accountability

```yaml
accountability:
  v10_5_prompt_template_authored_by_agent: true
  user_authorized_retry_from_agent_template: true
  prompt_design_failure_acknowledged: true
  failure_source_cn: "提示词仍然保留了会诱导软件界面、标题、logo 和人像样张的概念，导致 DoubaoGen 输出偏离纯产品静物目标。"
  next_real_generation_requires_prompt_preview: true
```

## Failure Analysis

```yaml
failure_analysis:
  failed_attempts_reviewed:
    - v10.4
    - v10.5
  v10_4_primary_failure:
    readable_text_or_logo_detected: true
    person_or_face_detected: false
    asset_status: rejected
  v10_5_primary_failure:
    readable_text_or_logo_detected: true
    person_or_face_detected: true
    brand_or_logo_risk_detected: true
    asset_status: rejected
  risky_prompt_concepts:
    - project_cover
    - photo_studio_os
    - software_interface
    - abstract_ui_shapes
    - negative_prompt_overload
  inferred_model_behavior_cn: "模型把软件封面和界面形状理解成带标题、图标、设备和人像样张的产品界面，而不是无文字的摄影棚静物。"
```

## Safer Strategy

```yaml
safer_strategy:
  strategy_name: positive_only_unbranded_still_life
  direct_doubaogen_cover_retry_recommended: false
  next_prompt_must_be_shown_to_user_before_execution: true
  avoid_concepts_in_generation_prompt:
    - OS
    - app
    - software
    - interface
    - UI
    - cover
    - logo
    - brand
    - screen
    - monitor
    - person
    - portrait
  positive_subjects_only:
    - unmarked_camera_lens
    - softbox_light_panels
    - blank_color_blocks
    - matte_tabletop
    - plain_geometric_acrylic_shapes
    - clean_studio_background
  negative_terms_must_not_dominate_prompt: true
```

## Candidate Prompt Draft

此候选 prompt 是草案，不是执行授权。下一次真实调用前必须由用户再次确认插件、调用次数、输出目录和该 prompt。

```yaml
candidate_prompt_draft:
  language: zh-CN
  execution_authorized: false
  prompt_cn: "明亮摄影棚桌面静物摄影。画面中心是一枚无标识相机镜头，周围摆放柔光灯板、空白色块卡、纯色亚克力几何片和干净浅灰桌面。所有物体表面保持空白、干净、无标记。真实产品摄影，高级柔光，简洁构图，留出干净背景。"
  prompt_rules:
    uses_photo_studio_os_name: false
    uses_software_or_ui_terms: false
    uses_cover_or_brand_terms: false
    uses_people_terms: false
    positive_subjects_only: true
```

## Next Authorization Gate

```yaml
next_authorization_gate:
  next_real_generation_allowed_by_this_record: false
  next_real_generation_requires_new_authorization: true
  prompt_preview_required_before_real_call: true
  max_plugin_calls_default: 1
  output_directory_must_be_new: true
  memory_write_allowed_before_accepted_asset: false
  submitDraft_allowed: false
  commit_tag_push_pr_release_allowed_by_this_record: false
```

## Result Meaning

v10.6 表示：项目已经停止继续盲试 DoubaoGen。失败原因被归档，下一版 prompt 策略改成正向、无品牌、无界面、无封面概念的纯静物描述。该记录只提供候选 prompt 草案，不授权任何真实调用。
