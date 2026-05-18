# v14.176 Review Console Artifact Evidence Side-by-side Compare

```yaml
phase: v14_176_review_console_artifact_evidence_side_by_side_compare_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_compare_only
```

## Purpose

Add a local static side-by-side compare view to Review Console. The view compares
the currently selected recoverable accepted sample against the blocked lamp
candidate so reviewers can see why two samples are fully recoverable while the
third sample is still blocked by missing human approval.

## Compare Contract

```yaml
draft_output_key: artifact_evidence_compare_state
primary_artifact_id: accepted_womens_resort_relaxed_knit_codex_v2_001
comparison_artifact_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
compared_field_count: 10
primary_recoverable: true
comparison_blocked: true
lamp_blocker: human_approval_missing
hard_acceptance_three_full_samples_met: false
```

## Boundary

```yaml
static_compare_only: true
fetch_performed: false
file_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

This phase is a static review-console comparison only. It does not approve the
lamp candidate, write accepted_samples, write failure_samples, create a
production_candidate, fetch artifacts, call runtime, or prove real VCP
integration.
