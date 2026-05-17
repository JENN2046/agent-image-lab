# v14.163 Lamp v2 Generated Candidate Readiness

## Scope

```text
phase: v14_163_lamp_v2_generated_candidate_readiness
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: local_artifact_import_review_readiness_only
source_prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml
source_generation_authorization: user_allowed_one_more_codex_session_image_generation
artifact_ref: runs/real_generation/v14_162_codex_session_premium_portable_led_camping_lantern_v2_generation_trial/codex_session_v14_162_premium_portable_led_camping_lantern_v2_candidate_001.png
import_record_ref: tests/schema_examples/v14_163_lamp_v2_generated_candidate_import_record.json
artifact_sha256: ba55bae4cbddc7233545b1d6822d77f0c4048266c9d5fb3b0be3ab1aa328178b
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
```

The v2 lamp candidate improves the failed v14.161 direction by making the
product read more clearly as an outdoor portable LED lantern. The deep blue
background, blurred tree line, centered product scale, warm frosted diffuser,
black metal body, and dark horizontal table all support the intended premium
blue-hour camping hero direction.

Remaining review risk: the product is very tight in frame and the diffuser is
bright, so human review should decide whether it is a final hero candidate or
needs one more composition/material refinement. Until Jenn approves it, this
candidate remains `pending_human_review` and cannot be written to
`accepted_samples`.

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
warm_frosted_diffuser: pass_with_brightness_review_needed
lower_body_control_present: pass
no_people_hands_fire_smoke: pass
no_text_logo_watermark: pass
human_approval_present: fail_pending
accepted_samples_ready: false
```

## Next Gate

```text
recommended_next: human_review_v14_163_lamp_v2_candidate_then_either_mark_needs_revision_or_authorize_accepted_samples_metadata_registration
automatic_next_generation_recommended: false
automatic_accepted_samples_write_allowed: false
accepted_samples_write_requires_separate_authorization: true
production_candidate_write_requires_separate_authorization: true
memory_write_requires_separate_authorization: true
```
