# V14.124 Context Load Guide And Historical Docs Compaction

```yaml
phase: v14_124_context_load_guide_and_historical_docs_compaction
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_123_memory_delta_draft_schema_alignment_for_codex_reviews
status: completed_validated
```
## Purpose

This phase reduces context pollution from old and stale documents by creating a
current context loading guide and a historical document compaction index.

It does not delete, move, rewrite, or compress historical files in place. It
adds routing guidance so future sessions load the current control surfaces first
and retrieve old evidence only by exact lookup.

## Added Routing Artifacts

```yaml
context_load_guide: docs/CONTEXT_LOAD_GUIDE.md
historical_docs_compaction_index: docs/HISTORICAL_DOCS_COMPACTION_INDEX.md
validator_created: scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js
mvp_validator_updated: scripts/validate_mvp.ps1
```

## Compaction Decision

```yaml
default_context_packet_defined: true
historical_docs_demoted_to_targeted_lookup: true
docs_00_project_roadmap_not_default_context: true
v7_dense_chain_not_default_context: true
numbered_gate_chain_not_default_context: true
old_authorization_records_not_current_authorization: true
historical_docs_deleted_or_rewritten: false
```

## Why This Is The First Compression Step

The repository contains many historical phase records. Direct deletion or
mass-moving would risk losing audit evidence and breaking validators. The safe
first step is to make the current context packet explicit and mark old chains as
targeted reference only.

This creates immediate context relief without changing historical facts.

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
historical_docs_deleted: false
historical_docs_moved: false
historical_docs_rewritten: false
output_file_write_performed: false
```

## Validation

```text
node --check scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js: passed
node scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js: passed
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: review_console_memory_delta_handoff_refresh
  reason: >
    Context loading is now compressed through current control surfaces, so the
    next local product step can return to Review Console memory_delta handoff
    without dragging stale phase chains into default context.
domain_leads_queue:
  - keep current context packet small
  - use historical index only for exact trace questions
  - preserve all A5 and production boundaries
worker_scope:
  allowed:
    - local docs
    - local validators
    - .agent_board sync
  forbidden:
    - historical doc deletion or rewrite
    - provider/API/plugin/MCP
    - image generation
    - accepted_samples metadata write in this phase
    - failure_samples write
    - production_candidate promotion
    - DailyNote or VCP memory write
```
