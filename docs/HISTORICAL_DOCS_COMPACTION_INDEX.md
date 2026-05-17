# Historical Docs Compaction Index

Purpose: make old phase records discoverable without making them default
context.

This index is a routing layer. It does not delete, move, rewrite, or supersede
the historical records.

## Current Context First

Default future sessions should read:

```text
docs/CONTEXT_LOAD_GUIDE.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
.agent_board/HANDOFF.md
```

Then use the current v14 control records for the active three-month goal.

## Archive Bands

### Foundation And Early Planning

```text
docs/01_project_definition.md
docs/02_workflow_sop.md
docs/03_agent_roles.md
docs/04_review_scorecard.md
docs/07_vcp_memory_adaptation_plan.md
docs/08_photo_studio_os_visual_rules.md
```

Use only for original project intent or legacy terminology.

### Numbered Gate Chain

Pattern:

```text
docs/[0-9][0-9][0-9]_*.md
```

Use for older runtime, bridge, release, and delivery gate evidence. Do not load
as current operating context unless a validator or board entry points to a
specific file.

### V7 Dense Governance And Bridge Chain

Pattern:

```text
docs/v7_*.md
```

Status: historical high-volume governance, bridge, static review, product route,
and provider-trial evidence.

Default handling: targeted lookup only. Do not read the whole v7 chain for
current Codex-session image, accepted_samples metadata, or memory_delta draft
work.

### V8 To V10 Product And Runtime Follow-Up

Patterns:

```text
docs/v8_*.md
docs/v9_*.md
docs/v10_*.md
```

Status: historical product loops, commercial delivery reviews, runtime records,
and A5/provider diagnostics.

Default handling: targeted lookup only. Old provider execution records do not authorize new provider contact, plugin calls, image generation, DailyNote, VCP memory, or production writes.

### V11 To V13 Reconstruction And Canonical Model Work

Patterns:

```text
docs/v11_*.md
docs/v12_*.md
docs/v13_*.md
```

Status: historical reconstruction and canonical model alignment.

Default handling: use only when a current model, validator, or audit question
requires lineage proof.

### V14 Current Control Layer Work

Pattern:

```text
docs/v14_*.md
```

Status: current active control-layer series.

Default handling: prefer the latest v14 records and `.agent_board` state over
older v14 setup records. Do not treat any v14 A5 package as active unless the
current user message gives exact matching authorization.

## Large File Warning

`docs/00_project_roadmap.md` is a large historical ledger. Do not load it by
default. Search it only for specific tokens when a current board entry or user
question requires old roadmap evidence.

## Safe Search Patterns

Use exact identifiers:

```text
rg -n "v14_123|memory_delta_draft|accepted_womens_resort_relaxed_knit" docs .agent_board scripts
rg -n "AUTH-PENDING|selected_plugin|provider_contact_performed" docs .agent_board
rg -n "production_candidate|failure_samples|DailyNote_write" docs .agent_board schemas scripts
```

## Non-Authorization

This index is local documentation only. It does not authorize execution,
provider/API/plugin/MCP calls, image generation, memory writes, production
candidate promotion, real manifest/VCPChat/VCPToolBox reads, push, tag, release,
deploy, or destructive cleanup.
