# v0.6.54 - Exact New-Trial 003 Formal Human Approval Evidence Ingestion Packet

base_contract: AGENTS.md
phase: v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet
mode: Green
intent: local_implementation
risk_level: R1

## Purpose

Define the exact local packet that can later ingest Jenn's user-submitted formal
approval statement for selected `shot_2`.

This stage does not provide, infer, or fabricate the approval itself. It defines
the ingestion contract, validation guards, target binding, and downstream lock
state before any accepted-sample registration, durable archive write,
production-candidate promotion, DailyNote write, or VCP memory write.

## Source Truth

```yaml
source_phase: v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel
source_evidence_packet_phase: v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
reviewer_required: Jenn
approval_statement_source_is_user_submission: false
formal_human_approval_captured_now: false
accepted_samples_registration_ready_now: false
```

## Ingestion Contract

```yaml
ingestion_packet_type: pending_user_submission_formal_human_approval_ingestion_packet
required_input_source: future_user_submitted_jenn_approval_only
required_fields:
  - approval_statement_text
  - submitted_by
  - submitted_at
  - target_candidate_id
  - target_sample_id
  - artifact_sha256
  - boundary_acknowledgement
required_statement_tokens:
  - Jenn
  - v0_3_3_exact_new_trial_003_shot_2
  - accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
  - 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
  - fashion_lookbook_portrait
```

## Current Ingestion State

```yaml
ingestion_packet_only: true
approval_submission_present_now: false
approval_statement_text_present_now: false
approval_statement_source_is_user_submission: false
formal_human_approval_captured_now: false
accepted_samples_registration_ready_now: false
registration_unlock_allowed_now: false
next_write_action_allowed_now: false
current_blocker: user_submitted_jenn_approval_missing
```

## Boundary

```yaml
approval_ingestion_performed: false
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

Stop before any downstream write until a real Jenn user-submitted approval
statement is provided and validated against this ingestion contract.
