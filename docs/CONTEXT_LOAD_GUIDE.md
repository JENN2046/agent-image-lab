# Context Load Guide

Purpose: reduce context pollution from historical phase documents without
deleting or rewriting audit evidence.

This guide defines what a future Agent Image Lab session should load by default
and what should stay as targeted historical reference.

## Default Context Packet

Load these first for normal work:

```text
AGENTS.md
AGENTS.autopilot-overlay.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
.agent_board/HANDOFF.md
.agent_board/VALIDATION_LOG.md
docs/HISTORICAL_DOCS_COMPACTION_INDEX.md
docs/CONTEXT_LOAD_GUIDE.md
```

For the current long-term goal, also prefer the current v14 control records over
older phase chains:

```text
docs/v14_108_three_month_visual_control_layer_goal_activation.md
docs/v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.md
docs/v14_120_visual_series_taxonomy_review_scorecard_alignment.md
docs/v14_121_codex_session_prompt_package_library_governance.md
docs/v14_122_local_review_record_schema_refresh.md
docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md
```

## Do Not Load By Default

Do not bulk-load these surfaces during ordinary work:

```text
docs/00_project_roadmap.md
docs/v7_*.md
docs/v8_*.md
docs/v9_*.md
docs/v10_*.md
docs/v11_*.md
docs/v12_*.md
docs/v13_*.md
docs/[0-9][0-9][0-9]_*.md
```

They are historical evidence, not the default authority for the current task.
Use `rg` to retrieve exact records only when a current validator, board surface,
or user question requires historical proof.

## Authority Rule

Current active instruction, repository reality, `AGENTS.md`, and `.agent_board`
surfaces outrank historical phase records.

Historical records may prove what happened in an older phase.

They do not grant new authorization and do not override current hard stops.

## Retrieval Rule

Use targeted search before reading old documents:

```text
rg -n "<phase_id|artifact_id|sample_id|validator_name>" docs .agent_board scripts
```

Open only the smallest matching file set needed for the question. Avoid loading
large route chains when one current phase record or validator proves the point.

## Compression Policy

Compression means:

```text
summarize old chains into current indexes
route future sessions through current control records
keep old files as audit evidence
read historical docs only on demand
```

Compression does not mean:

```text
delete old docs
rewrite historical facts
weaken A5 gates
turn old authorization records into current authorization
hide validation failures
```

## Current Hard Stops Preserved

This guide does not authorize:

```text
provider/API/plugin/MCP calls
image generation
.env or .env.local value reads
DailyNote writes
VCP memory writes
failure_samples writes
production_candidate promotion
real manifest/VCPChat/VCPToolBox reads
push/tag/release/deploy
destructive filesystem or Git actions
```
