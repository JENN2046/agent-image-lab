# V14.130 Legacy Docs Context Quarantine Refresh

```yaml
phase: v14_130_legacy_docs_context_quarantine_refresh
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_129_current_goal_completion_audit_gap_map
status: completed_validated
```

## Purpose

This phase compresses old and stale documentation for future context loading.

It does not delete, move, or rewrite historical documents. It adds a quarantine
map and refreshes the context guide so future sessions start from the board
surfaces and v14.129 audit instead of bulk-loading old phase chains.

## Compression Result

```yaml
legacy_docs_context_quarantine_created: true
context_load_guide_hot_packet_refreshed: true
historical_compaction_index_quarantine_refreshed: true
current_goal_audit_is_hot_context: true
v14_129_preferred_over_old_v14_chain: true
bulk_historical_load_allowed: false
targeted_lookup_required_for_legacy_docs: true
historical_docs_deleted: false
historical_docs_moved: false
historical_docs_rewritten: false
```

## Practical Meaning

Future work should treat old documents as evidence, not active direction.

Read by default:

```text
AGENTS.md
AGENTS.autopilot-overlay.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
.agent_board/HANDOFF.md
docs/CONTEXT_LOAD_GUIDE.md
docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md
docs/v14_129_current_goal_completion_audit_gap_map.md
```

Search before opening old chains:

```text
rg -n "<phase_id|artifact_id|sample_id|validator_name>" docs .agent_board scripts
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
output_file_write_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```text
node --check scripts/validate_v14_130_legacy_docs_context_quarantine_refresh.js: passed
node scripts/validate_v14_130_legacy_docs_context_quarantine_refresh.js: passed
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: review_console_current_goal_gap_dashboard_alignment
  reason: >
    Old document context is now compressed behind a quarantine map, so the next
    local step can safely return to exposing the current goal gap audit in the
    display-only Review Console handoff.
domain_leads_queue:
  - keep future context loads short
  - use legacy docs only by exact token search
  - preserve current A5 and production boundaries
worker_scope:
  allowed:
    - local docs
    - local validators
    - .agent_board sync
  forbidden:
    - deleting or moving historical docs
    - provider/API/plugin/MCP
    - image generation
    - accepted_samples metadata write in this phase
    - failure_samples write
    - production_candidate promotion
    - DailyNote or VCP memory write
```
