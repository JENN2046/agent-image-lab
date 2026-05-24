# v0.6.52 - Exact New-Trial 003 Formal Human Approval Evidence Capture Packet

base_contract: AGENTS.md
phase: v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet
mode: Green
intent: local_implementation
risk_level: R1

## Purpose

Define the exact local evidence packet that can later prove Jenn formally
approved the selected `shot_2` candidate before any accepted-sample
registration, durable archive write, production-candidate promotion, DailyNote
write, or VCP memory write.

This stage does not capture or invent approval. It turns the approval boundary
into a concrete, reviewable, validator-enforced contract.

## Source Truth

```yaml
source_phase: v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet
human_approval_intake_source: v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package
target_candidate_id: v0_3_3_exact_new_trial_003_shot_2
target_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
category: fashion_lookbook_portrait
reviewer_required: Jenn
formal_human_approval_status: pending
formal_human_approval_captured_now: false
approval_statement_source_is_user_submission: false
accepted_samples_registration_ready_now: false
```

## Evidence Capture Contract

The future approval evidence must preserve all fields below:

```yaml
required_reviewer: Jenn
required_candidate_id: v0_3_3_exact_new_trial_003_shot_2
required_sample_id: accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001
required_category: fashion_lookbook_portrait
required_artifact_ref: runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png
required_sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b
required_dimensions: 941x1672
required_mime: image/png
required_statement_source: user_submitted_jenn_approval
required_boundary_acknowledgement:
  - accepted_samples metadata registration only after evidence is captured
  - no image copy during approval capture
  - no runs source mutation during approval capture
  - no production_candidate write during approval capture
  - no DailyNote write during approval capture
  - no VCP memory write during approval capture
  - no provider/plugin/API/runtime call during approval capture
  - no secret read during approval capture
  - no push/tag/release/deploy during approval capture
```

## Current Evidence State

```yaml
evidence_packet_only: true
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

Prepare a local Review Console formal-human-approval capture surface or
equivalent evidence-entry packet that can accept a future Jenn-submitted
approval statement without writing accepted-sample, archive, production, or
memory records.
