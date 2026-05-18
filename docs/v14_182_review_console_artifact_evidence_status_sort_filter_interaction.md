# v14.182 Review Console Artifact Evidence Status Sort Filter Interaction

```yaml
phase: v14_182_review_console_artifact_evidence_status_sort_filter_interaction_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_filter_sort_interaction_only
```

## Purpose

Define how local lifecycle filters interact with the v14.180 blocked-first
artifact evidence sort. The interaction keeps the full evidence view focused
on the blocked lamp candidate while still allowing the recoverable and blocked
filters to show their own scoped local lists.

## Interaction State

```yaml
draft_output_key: artifact_evidence_status_sort_filter_interaction_state
source_sort_key: artifact_evidence_status_sort_state
sort_mode: blocked_candidates_first
all_filter_blocked_candidate_first: true
recoverable_filter_excludes_blocked_candidate: true
blocked_filter_only_blocked_candidate: true
local_filter_only: true
```

## Boundary

```yaml
static_interaction_only: true
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

This phase is a static local filter/sort interaction only. It does not approve
the lamp candidate, write accepted_samples, write failure_samples, create a
production_candidate, fetch artifacts, call runtime, or prove real VCP
integration.
