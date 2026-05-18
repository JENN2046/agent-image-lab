# v14.215 Third Sample accepted_samples Post-Approval Gate Alignment

```yaml
phase: v14_215_third_sample_accepted_samples_post_approval_gate_alignment
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: post_approval_gate_alignment_only
```

## Purpose

Align the future third-sample `accepted_samples` registration gate with the new
v14.214 approval intake validator. Earlier preflights narrowed the future write
scope, but the gate now must also prove that Jenn's approval was captured from
a real user submission and that the exact approval statement matches the
v14.213 request package.

This phase does not capture approval, does not write `accepted_samples`, and
does not treat the lamp candidate as accepted.

## Current Decision

```yaml
gate_status: blocked
blocker: human_approval_missing
candidate_id: v14_166_lamp_v3_generated_candidate_001
proposed_sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
category: product_still_life
approval_request_ref: docs/v14_213_lamp_third_sample_human_approval_request_package.md
approval_intake_validator_ref: scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js
approval_statement_source_is_user_submission: false
approval_statement_matches_required_form: true
human_approval_captured_now: false
registration_unlocks_only_after_external_user_approval: true
accepted_samples_registration_ready_now: false
```

## Future Registration Gate

```yaml
required_before_accepted_samples_write:
  - v14.166 readiness evidence still passes
  - v14.167 blocker is cleared by real Jenn approval
  - v14.213 exact approval sentence is used
  - v14.214 intake validator reports approval_statement_source_is_user_submission=true
  - v14.214 intake validator reports human_approval_captured_now=true
  - allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/product_still_life.yaml
  - no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory
```

## Guard

```yaml
post_approval_gate_alignment_only: true
accepted_samples_write_performed: false
category_index_write_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
env_or_secret_read_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
staging_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

This phase upgrades the future registration gate from "manual approval exists"
to "manual approval is captured as a real user submission and validated by the
v14.214 intake validator". It does not execute the registration or prove VCP
runtime integration.
