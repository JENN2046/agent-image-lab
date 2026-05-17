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
docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md
docs/CONTEXT_LOAD_GUIDE.md
```

## Hot Context Packet

For ordinary continuation work, load the board surfaces and the latest hot
context packet before opening any historical phase chain:

```text
docs/v14_129_current_goal_completion_audit_gap_map.md
docs/v14_124_context_load_guide_and_historical_docs_compaction.md
docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md
```

Then use exact search for supporting records such as v14.119 through v14.128
only when the current audit, board state, or validator asks for proof.

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

Also avoid bulk-loading all `docs/v14_*.md`. Only the hot context packet is
default context. Other v14 records are current-series evidence, but they are
still targeted lookup unless the active task names them.

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

## Legacy Quarantine Rule

Old route chains are quarantined from default context. Quarantine means:

```text
keep files in place for auditability
summarize the chain in docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md
read exact old records only after a token search
prefer current board state and v14.129 audit for active-goal status
```

This prevents stale A5 packages, old provider trials, old runtime bridge work,
or obsolete route decisions from polluting current Codex-session visual work.

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
