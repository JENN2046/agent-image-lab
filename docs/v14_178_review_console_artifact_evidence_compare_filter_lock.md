# v14.178 Review Console Artifact Evidence Compare Filter Lock

```yaml
phase: v14_178_review_console_artifact_evidence_compare_filter_lock_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_filter_lock_validation_only
```

## Purpose

Lock the Review Console artifact evidence comparison to the blocked lamp
candidate even when the local lifecycle filter changes. This prevents the
compare panel from becoming misleading when the operator filters the lifecycle
list to only recoverable samples.

## Filter Lock

```yaml
draft_output_key: artifact_evidence_compare_state
primary_artifact_id: accepted_womens_resort_relaxed_knit_codex_v2_001
comparison_artifact_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
locked_to_blocked_candidate: true
locked_blocker: human_approval_missing
ignores_lifecycle_filter: true
comparison_source: blocked_registration_candidate
locked_comparison_artifact_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
hard_acceptance_three_full_samples_met: false
```

## Boundary

```yaml
static_filter_lock_only: true
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

This phase is a static local compare-filter lock only. It does not approve the
lamp candidate, write accepted_samples, write failure_samples, create a
production_candidate, fetch artifacts, call runtime, or prove real VCP
integration.
