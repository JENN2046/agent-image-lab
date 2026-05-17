# Legacy Docs Context Quarantine

Purpose: compress old and stale documentation into a small routing map so future
sessions do not bulk-load historical chains as current context.

This file is a context-control artifact. It does not delete, move, rewrite, or
supersede historical evidence.

## Default Rule

```yaml
legacy_docs_context_quarantine_active: true
default_context_should_start_from_board_surfaces: true
hot_context_packet_ref: docs/CONTEXT_LOAD_GUIDE.md
current_goal_audit_ref: docs/v14_129_current_goal_completion_audit_gap_map.md
historical_lookup_index_ref: docs/HISTORICAL_DOCS_COMPACTION_INDEX.md
bulk_historical_load_allowed: false
historical_docs_deleted: false
historical_docs_moved: false
historical_docs_rewritten: false
```

## Quarantined Bands

```yaml
large_ledger:
  pattern: docs/00_project_roadmap.md
  handling: targeted_lookup_only
  reason: high-density historical ledger that can overwhelm current context
numbered_runtime_and_release_chain:
  pattern: docs/[0-9][0-9][0-9]_*.md
  handling: targeted_lookup_only
  reason: older runtime, bridge, release, and delivery gates are evidence, not current authority
v7_bridge_and_vcpchat_chain:
  pattern: docs/v7_*.md
  handling: targeted_lookup_only
  reason: dense VCPChat and bridge chain contains stale authorization and runtime context
v8_to_v10_provider_and_product_chain:
  pattern: docs/v8_*.md; docs/v9_*.md; docs/v10_*.md
  handling: targeted_lookup_only
  reason: provider/API/image generation records are historical and do not authorize new execution
v11_to_v13_reconstruction_chain:
  pattern: docs/v11_*.md; docs/v12_*.md; docs/v13_*.md
  handling: targeted_lookup_only
  reason: reconstruction and canonical model lineage should be retrieved only for proof
older_v14_control_records:
  pattern: docs/v14_001_*.md through docs/v14_128_*.md
  handling: targeted_lookup_only_unless_named_by_current_audit
  reason: current active status is summarized by v14.129 and the board surfaces
```

## Retrieval Protocol

```text
1. Read AGENTS.md, overlay, and .agent_board surfaces.
2. Read docs/CONTEXT_LOAD_GUIDE.md and this quarantine map.
3. Read docs/v14_129_current_goal_completion_audit_gap_map.md for current goal status.
4. Use rg with exact tokens before opening historical records.
5. Open only the smallest matching file set.
```

Recommended searches:

```text
rg -n "phase_id|sample_id|validator_name|authorization_id" docs .agent_board scripts
rg -n "provider_contact_performed|image_generation_performed|DailyNote_write_performed" docs .agent_board
rg -n "production_candidate|failure_samples|accepted_samples" docs .agent_board schemas scripts
```

## Non-Authorization

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
push_tag_release_deploy_performed: false
```
