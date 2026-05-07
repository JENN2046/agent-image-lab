# v10.7 A5 Safer Prompt Review Package

本文记录 Agent Image Lab v10.7 A5 safer prompt review package。v10.6 已确认 v10.5 prompt 模板由 agent 给出且设计失败，本阶段把下一版候选 prompt 作为人工复核包固定下来，并用本地 validator 检查 prompt 不包含已知高风险触发词。

本阶段不调用插件、不调用 API、不写 DailyNote、不写 VCP memory、不创建图片，不执行 commit/tag/push/PR/release。该 prompt review package 只用于让用户确认下一次是否值得单独授权真实生成。

```yaml
status: completed_validated_v10_7_a5_safer_prompt_review_package
version: v10.7
current_phase: "v10.7 A5 safer prompt review package"
validation_file: scripts/validate_v10_7_a5_safer_prompt_review_package.js
previous_phase: "v10.6 A5 prompt failure analysis and safer strategy"
previous_record: docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md
default_next_phase: "BLOCKED for user approval of prompt plus separate real generation authorization"
```

## Prompt Preview

```yaml
prompt_preview:
  prompt_id: a5_positive_still_life_prompt_v1
  language: zh-CN
  execution_authorized: false
  prompt_cn: "明亮摄影棚桌面静物摄影。画面中心是一枚无标识相机镜头，周围摆放柔光灯板、空白色块卡、纯色亚克力几何片和干净浅灰桌面。所有物体表面保持空白、干净、无标记。真实产品摄影，高级柔光，简洁构图，留出干净背景。"
  prompt_intent_cn: "只生成无品牌、无界面、无人物的摄影棚产品静物，不把项目名、软件名或封面概念交给模型。"
```

## Prompt Scan Result

```yaml
prompt_scan_result:
  prompt_preview_performed: true
  prompt_string_scanned: true
  risky_english_terms_absent: true
  uses_photo_studio_os_name: false
  uses_software_or_ui_terms: false
  uses_cover_or_brand_terms: false
  uses_people_terms: false
  uses_screen_or_monitor_terms: false
  positive_subjects_only: true
  negative_prompt_overload: false
  prompt_length_reasonable: true
```

## Approval Gate

```yaml
approval_gate:
  user_prompt_approval_required: true
  next_real_generation_allowed_by_this_record: false
  next_real_generation_requires_new_authorization: true
  selected_plugin_default: DoubaoGen
  max_plugin_calls_default: 1
  output_directory_must_be_new: true
  memory_write_allowed_before_accepted_asset: false
  daily_note_write_allowed_before_accepted_asset: false
  vcp_memory_write_allowed_before_accepted_asset: false
  submitDraft_allowed: false
  commit_tag_push_pr_release_allowed_by_this_record: false
```

## Recommended Next Authorization Shape

以下只是下一次授权形状，不是当前授权。

```yaml
next_authorization_template:
  phase: v10.8_a5_positive_still_life_single_generation
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  input_reference: "<use prompt_preview.prompt_cn exactly unless user edits it>"
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
  overwrite_existing_files_allowed: false
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## Result Meaning

v10.7 表示：下一版候选 prompt 已经收束成可复核包，并通过本地扫描。它仍然不是执行授权。只有用户明确批准该 prompt 和下一次真实生成参数后，才允许进入 v10.8。
