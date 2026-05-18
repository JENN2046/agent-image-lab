# v14.180 Review Console Artifact Evidence Status Sort

```yaml
phase: v14_180_review_console_artifact_evidence_status_sort_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_status_sort_only
```

## Purpose

Sort local Review Console artifact evidence by recoverability status so blocked
registration candidates stay visible before recoverable accepted samples. This
keeps the lamp candidate and the remaining one-sample gap visible without
changing any sample state.

## Sort State

```yaml
draft_output_key: artifact_evidence_status_sort_state
sort_mode: blocked_candidates_first
blocked_candidate_first: true
blocked_candidate_artifact_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
blocked_candidate_blocker: human_approval_missing
recoverable_count: 2
blocked_count: 1
hard_acceptance_three_full_samples_met: false
```

## Boundary

```yaml
static_sort_only: true
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

This phase is a static local sort only. It does not approve the lamp candidate,
write accepted_samples, write failure_samples, create a production_candidate,
fetch artifacts, call runtime, or prove real VCP integration.
