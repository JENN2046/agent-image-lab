# v0.6.53 - Exact New-Trial 003 Formal Human Approval Capture Surface Static Panel

base_contract: AGENTS.md
phase: v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel
mode: Green
intent: local_implementation
risk_level: R1

## Purpose

Add a static Review Console surface that shows exactly what a future
Jenn-submitted formal approval record must contain for the selected `shot_2`
candidate.

This stage does not capture approval, register an accepted sample, archive an
asset, promote a production candidate, call a provider, generate an image, write
DailyNote, or write VCP memory.

## Source Truth

```yaml
source_phase: v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet
source_packet_ref: reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
reviewer_required: Jenn
formal_human_approval_status: pending
formal_human_approval_captured_now: false
approval_statement_source_is_user_submission: false
accepted_samples_registration_ready_now: false
```

## Static Surface Contract

```yaml
draft_output_key: exact_new_trial_003_formal_human_approval_capture_surface_state
capture_surface_status: static_capture_ready_pending_jenn_submission
required_capture_fields:
  - approval_statement_text
  - submitted_by
  - submitted_at
  - boundary_acknowledgement
required_statement_tokens:
  - Jenn
  - v0_3_3_exact_new_trial_003_shot_2
  - accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
  - 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
  - 941x1672
  - fashion_lookbook_portrait
```

## Current Evidence State

```yaml
approval_evidence_present_now: false
approval_statement_text_present_now: false
approval_statement_source_is_user_submission: false
formal_human_approval_captured_now: false
registration_unlock_allowed_now: false
next_write_action_allowed_now: false
current_blocker: formal_human_approval_evidence_missing
```

## Boundary

```yaml
static_panel_only: true
read_only_capture_surface: true
approval_capture_performed: false
approval_evidence_fabricated: false
accepted_samples_write_performed: false
archive_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
secret_value_read_performed: false
staging_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
```

## Next Safe Task

Prepare a future exact formal approval evidence ingestion packet or validator
path that can consume Jenn's user-submitted approval statement without creating
accepted-sample, archive, production, DailyNote, or VCP memory records.
