# v14.230 Artifact Restoration A5 Authorization Package Draft

```yaml
phase: v14_230_artifact_restoration_a5_authorization_package_draft
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R3
execution_mode: artifact_restoration_authorization_package_draft_only
authorization_status: draft_inactive
execution_allowed_now: false
```

## Superseded Route Note

```yaml
route_status: superseded_by_v14_231_git_tracked_preview_evidence_capsule_baseline
reason: old artifact restoration is no longer the current route after the user confirmed the old runs evidence is unavailable on the new computer
replacement_route: new durable archive baseline using Git-tracked preview.webp evidence capsules
base64_allowed: false
original_sha256_tracked: false
old_runs_restoration_required_before_next_baseline: false
```

## Purpose

Prepare the smallest explicit A5 package needed to unblock
`scripts/validate_mvp.ps1` after the current clone proved that required
`runs/real_generation/` evidence is absent.

This draft does not restore files, copy images, call providers, call plugins,
generate images, read VCPChat, read VCPToolBox, read real manifests, write
DailyNote, write VCP memory, stage, commit, push, tag, release, or deploy.

## Current Failure

```yaml
current_validation:
  command: powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
  status: failed
  primary_cause: missing_ignored_runs_artifacts_and_import_records
  git_tracking_reality:
    runs_gitignored: true
    tracked_runs_files:
      - runs/real_generation/.gitkeep
      - runs/real_generation/README.md
```

## Required Evidence Targets

These are project-relative target paths only. The source bundle path must be
provided by the user in a separate explicit A5 approval and must not be guessed
or inferred by Codex.

```yaml
required_targets:
  - runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json
  - runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
  - runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
  - runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png
  - runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png
  - runs/real_generation/v14_162_codex_session_premium_portable_led_camping_lantern_v2_generation_trial/codex_session_v14_162_premium_portable_led_camping_lantern_v2_candidate_001.png
  - runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png
```

## Minimum A5 Authorization Needed

```yaml
a5_authorization_package:
  target_systems:
    - Agent Image Lab local workspace
  source_bundle_ref: "<TO_BE_FILLED_BY_USER>"
  exact_allowed_source_paths:
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_162_codex_session_premium_portable_led_camping_lantern_v2_generation_trial/codex_session_v14_162_premium_portable_led_camping_lantern_v2_candidate_001.png"
    - "<TO_BE_FILLED_BY_USER>/runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png"
  exact_allowed_target_paths:
    - runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json
    - runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
    - runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
    - runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png
    - runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png
    - runs/real_generation/v14_162_codex_session_premium_portable_led_camping_lantern_v2_generation_trial/codex_session_v14_162_premium_portable_led_camping_lantern_v2_candidate_001.png
    - runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png
  allowed_operations:
    - create_missing_parent_directories_for_exact_target_paths
    - copy_exact_files_from_approved_source_to_exact_targets
    - verify_sha256_and_png_dimensions_after_copy
    - run_targeted_recoverability_validators
  forbidden_operations:
    - provider_contact
    - plugin_call
    - api_call
    - image_generation
    - image_editing
    - DailyNote_write
    - VCP_memory_write
    - VCPChat_read
    - VCPToolBox_read
    - real_manifest_read
    - production_candidate_write
    - accepted_samples_write
    - failure_samples_write
    - dependency_change
    - git_add_dot
    - push
    - tag
    - release
    - deploy
    - destructive_git_or_filesystem_action
  overwrite_existing_files_allowed: false
  rollback_plan:
    - remove_only_files_created_by_this_exact_restoration
    - leave_preexisting_files_untouched
    - rerun_git_status_and_targeted_validators
  reviewer: Jenn
  stop_conditions:
    - source_bundle_ref_missing
    - source_hash_or_dimensions_mismatch
    - target_file_already_exists
    - unexpected_file_required
    - any_secret_or_private_data_detected
    - any_request_to_call_provider_plugin_api_or_generate_image
```

## Validation After Authorized Copy

```yaml
validation_required_after_copy:
  - node scripts/validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js
  - node scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js
  - node scripts/validate_v14_142_multi_accepted_sample_matrix.js
  - node scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js
  - node scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js
  - node scripts/validate_v14_210_exact_file_commit_readiness_review.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Current Decision

```yaml
decision: blocked_waiting_for_explicit_A5_artifact_restoration_authorization
copy_performed_now: false
runs_write_performed_now: false
durable_archive_copy_performed_now: false
provider_contact_performed_now: false
plugin_call_performed_now: false
api_call_performed_now: false
image_generation_performed_now: false
DailyNote_write_performed_now: false
VCP_memory_write_performed_now: false
runtime_execution_performed_now: false
push_tag_release_deploy_performed_now: false
```
