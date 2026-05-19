# C1 Human-Navigation Records Decision Package

base_contract: AGENTS.md
mode: A4.8 local docs-only decision package
status: dry_run_only_no_execution

## Purpose

Keep the remaining 39 human-navigation archive records out of automatic
movement until semantic review is complete.

## Source Evidence

```text
docs/archive/DOCS_ARCHIVE_C1AN_HUMAN_NAVIGATION_DECISION_PACKAGE.md
docs/archive/DOCS_ARCHIVE_C1AN_HUMAN_NAVIGATION_DECISION_PACKAGE.csv
```

## Decision

All 39 records remain blocked from automatic move/rewrite/wrapper action.

They may affect current entrypoints, reader navigation, route explanation, or
human-facing project history, so they require Jenn or project-owner review
before any archive action.

## Future Review Buckets

```yaml
retain_current_entrypoint: pending_human_review
paired_move_and_rewrite: pending_human_review
wrapper_required: pending_human_review
archive_only_reference: pending_human_review
```

## Non-Authorization

- no file movement
- no reference rewrite
- no wrapper creation
- no validator behavior change
- no provider/API/plugin/MCP/image generation/.env/real manifest/VCPChat/VCPToolBox/DailyNote/VCP memory action
- no push/tag/release/deploy
