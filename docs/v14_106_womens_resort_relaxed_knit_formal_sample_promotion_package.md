# v14.106 Women's Resort Relaxed Knit Formal Sample Promotion Package

```yaml
phase: v14_106_womens_resort_relaxed_knit_formal_sample_promotion_package
base_contract: AGENTS.md
mode: A4.8_formal_sample_authorization_package_only
intent: local_draft
risk_level: R2
source_phase: v14_105_codex_session_womens_resort_relaxed_knit_final_candidate
selected_asset: womens_resort_relaxed_knit_final_v2
source_image_path: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
source_import_record: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
source_review_record: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md
asset_sha256: 9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910
asset_dimensions: 1254x1254
formal_sample_write_performed: false
accepted_samples_write_allowed_now: false
production_candidate_write_allowed_now: false
memory_write_allowed_now: false
```

## Purpose

This package prepares the v14.105 women's resort relaxed knit final visual candidate for a future formal accepted sample registry write.

It does not write `accepted_samples/`, does not copy or commit image binaries, does not mark the asset as a production candidate, and does not write DailyNote or VCP memory.

## Formal Sample Decision

```yaml
formal_sample_decision:
  recommendation: promote_to_accepted_sample_registry_after_explicit_authorization
  proposed_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
  proposed_category: fashion_lookbook_portrait
  source_provider_type: codex_session_image
  plugin_id: null
  model: codex_session_builtin_image_generation
  prompt_package_ref: session_prompt_inline:womens_resort_relaxed_knit_final_v2
  review_doc_ref: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md
  image_path: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
  image_files_committed_to_git: false
  asset_status: accepted_candidate
  commercial_use_level: accepted_candidate
  commercial_delivery_ready: false
  memory_suitability: deferred
```

## Acceptance Rationale

```yaml
acceptance_summary:
  adult_model_only: pass
  clothing_first_visual: pass
  resort_relaxed_direction_clear: pass
  knit_texture_visible: pass
  trouser_pleats_and_drape_visible: pass
  background_secondary: pass
  decorative_prop_removed: pass
  not_beige_washed: pass
  hands_and_pose: pass
  no_text_logo_watermark: pass
  no_extra_people: pass
  commercial_usability: pass
  memory_suitability: false
```

The asset qualifies as a formal accepted sample candidate because it is a clean square fashion hero portrait with clear apparel read, visible knit texture, readable trouser drape, controlled coastal background, no competing props, no text or logos, and no visible watermark.

The asset should remain `commercial_delivery_ready: false` because it is accepted as a reusable visual sample, not as a finalized delivery package. It also remains `memory_suitability: deferred` until a separate memory review and write authorization exists.

## Known Minor Issues

```yaml
known_minor_issues:
  - lower_trouser_hem_not_visible_because_square_hero_crop_is_upper_body_dominant
  - model_face_and_upper_body_are_visually_strong_so_full_garment_catalog_detail_is_not_complete
```

These issues do not block accepted sample registry inclusion because the target role is a square hero/lookbook portrait rather than a full-body catalog image.

## Future Registry Write Plan

```yaml
future_write_plan:
  exact_allowed_paths:
    - accepted_samples/accepted_sample_registry.yaml
    - accepted_samples/categories/fashion_lookbook_portrait.yaml
  exact_forbidden_paths:
    - runs/real_generation/**
    - .env
    - .env.local
    - config.env
    - memory/**
    - DailyNote/**
    - production_candidate/**
  allowed_operations:
    - append one accepted sample registry entry for proposed_sample_id
    - create or update the fashion_lookbook_portrait category index with proposed_sample_id
    - keep image_files_committed_to_git false
    - keep write_to_memory_allowed false
    - keep daily_note_write_allowed false
  forbidden_operations:
    - copy image binary into accepted_samples
    - modify source image
    - generate or edit any image
    - provider contact
    - plugin call
    - API call
    - read .env or .env.local secret values
    - DailyNote write
    - VCP memory write
    - production_candidate write
    - push, tag, release, or deploy
```

## Exact Authorization Statement

Use this exact approval text only if the next step is to write the accepted sample registry entry:

```text
批准进入 AUTH-PENDING-WOMENS-RESORT-KNIT-FORMAL-SAMPLE-20260517-001 A5 accepted_samples registry write execution：将 runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png 作为 accepted_womens_resort_relaxed_knit_codex_v2_001 正式样片登记到项目 accepted_samples 元数据；允许仅修改 accepted_samples/accepted_sample_registry.yaml 和 accepted_samples/categories/fashion_lookbook_portrait.yaml；允许创建 fashion_lookbook_portrait.yaml；不允许复制或提交图片文件，不允许修改 runs/real_generation/ 源图片，不允许 provider/API/plugin/MCP 调用，不允许读取 .env 或 .env.local 密钥值，不允许 DailyNote 写入，不允许 VCP memory 写入，不允许 production_candidate 写入，不允许 real manifest/VCPChat/VCPToolBox 读取，不允许 push/tag/release/deploy；写入后运行 git diff --check、node scripts/validate_agent_board_state.js、powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1、powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1 并停止汇报结果；审批人 Jenn。
```

## Closeout

```yaml
closeout:
  phase: v14_106_womens_resort_relaxed_knit_formal_sample_promotion_package
  package_created: true
  formal_sample_write_performed: false
  accepted_samples_written: false
  production_candidate_started: false
  memory_write_performed: false
  daily_note_write_performed: false
  provider_contact_performed: false
  image_generation_performed_by_project_script: false
  recommended_next: wait_for_exact_authorization_statement_before_accepted_samples_registry_write
```
