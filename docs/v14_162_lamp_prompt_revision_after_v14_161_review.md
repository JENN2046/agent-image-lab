# v14.162 Lamp Prompt Revision After v14.161 Review

## Scope

```text
phase: v14_162_lamp_prompt_revision_after_v14_161_review
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R1
execution_mode: prompt_package_only_no_generation
source_candidate_ref: runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png
source_review_record_ref: docs/v14_161_codex_session_generated_candidate_readiness.md
prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml
source_review_status: needs_revision
human_direction: first_image_needs_optimization_second_image_can_pass
image_generation_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
env_local_secret_value_read_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
durable_archive_copy_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Revision Target

The first v14.161 image is not rejected because of composition basics. It has a
strong square crop, centered product scale, black metal shell, warm diffuser, and
dark horizontal table. The remaining problem is product positioning: it can read
too much like an indoor desk or ambience lamp instead of a premium portable LED
camping lantern.

The v14.162 prompt therefore keeps the useful visual assets and changes the
identity layer:

```text
keep: large centered product, black metal, warm frosted diffuser, dark horizontal table, deep blue-hour mood
change: clearer portable camping lantern identity, outdoor utility cues, sharper selling points, stronger outdoor blue-hour context
forbid: indoor desk lamp mood, office desk, bedside lamp, bright window, generic table lamp drift
```

## Static Review

```text
prompt_package_created: true
prompt_package_static_review_passed: true
codex_session_generation_ready_after_authorization: true
generation_authorized_by_this_record: false
accepted_samples_authorized_by_this_record: false
```

## Next Gate

```text
recommended_next: request_exact_codex_session_generation_authorization_for_v14_162_lamp_candidate_or_register_bag_candidate_after_accepted_samples_authorization
automatic_next_generation_recommended: false
image_generation_requires_separate_authorization: true
accepted_samples_write_requires_separate_authorization: true
production_candidate_write_requires_separate_authorization: true
memory_write_requires_separate_authorization: true
```
