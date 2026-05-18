# v14.166 Lamp v3 Generated Candidate Readiness

## Scope

```text
phase: v14_166_lamp_v3_generated_candidate_readiness
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: local_artifact_import_review_readiness_only
source_prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml
source_generation_authorization: user_allowed_one_more_codex_session_image_generation
codex_session_generation_completed_under_user_authorization: true
artifact_ref: runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png
import_record_ref: tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json
artifact_sha256: eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c
artifact_dimensions: 1254x1254
artifact_mime: image/png
review_status: pending_human_review
accepted_candidate: false
human_approval_status: pending
commercial_delivery_ready: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed_by_project: false
plugin_call_performed_by_project: false
api_call_performed_by_project: false
mcp_runtime_performed_by_project: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
durable_archive_copy_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Internal Visual Review

```text
decision: internal_visual_review_ready_for_human_judgment
formal_acceptance_status: pending_human_review
commercial_delivery_ready: false
memory_suitability: deferred
third_full_recoverable_sample_candidate_created: true
third_full_recoverable_sample_still_requires_human_approval: true
```

The v3 lamp candidate is stronger than the prior lamp direction for the current
portable LED camping lantern hero target. It keeps a square hero frame, makes
the product the first visual focus, uses a dark horizontal table, preserves the
blue-hour outdoor context, and avoids the earlier indoor desk-lamp drift.

Remaining review risk: the diffuser is still a broad glowing surface, so Jenn
should decide whether the material texture is premium enough for the third full
accepted sample. Until Jenn approves it, this candidate remains
`pending_human_review` and cannot be written to `accepted_samples`.

## Checklist

```text
fixed_1_to_1_square_frame: pass
single_product_only: pass
portable_led_camping_lantern_read: pass
indoor_desk_lamp_drift_reduced: pass
centered_product: pass
product_first_visual_focus: pass
deep_blue_hour_outdoor_context: pass
background_secondary: pass
dark_horizontal_table: pass
premium_black_metal_shell: pass
warm_frosted_diffuser: pass_with_material_texture_review_needed
lower_body_control_present: pass
no_people_hands_fire_smoke: pass
no_text_logo_watermark: pass
human_approval_present: fail_pending
accepted_samples_ready: false
```

## Next Gate

```text
recommended_next: human_review_v14_166_lamp_v3_candidate_then_either_register_as_third_accepted_sample_or_mark_needs_revision
automatic_next_generation_recommended: false
automatic_accepted_samples_write_allowed_after_human_approval: true_within_goal_metadata_only_boundary
accepted_samples_write_requires_human_approval: true
production_candidate_write_requires_separate_authorization: true
memory_write_requires_separate_authorization: true
```
