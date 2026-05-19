# P7 Human-Navigation 39 Decision Review Plan

base_contract: AGENTS.md
mode: A4.8 docs-only semantic review planning
status: prepared_validated_no_execution

## Purpose

Keep the remaining 39 human-navigation records out of automatic archive
movement until a project-owner semantic decision exists for each record.

## Decision Buckets

Each record must be reviewed into exactly one bucket:

```yaml
retain_current_entrypoint: pending_human_review
paired_move_and_rewrite: pending_human_review
wrapper_required: pending_human_review
archive_only_reference: pending_human_review
```

Source evidence:

```text
docs/C1_HUMAN_NAVIGATION_RECORDS_DECISION_PACKAGE.md
docs/archive/DOCS_ARCHIVE_C1AN_HUMAN_NAVIGATION_DECISION_PACKAGE.csv
```

## Review Rules

- Do not auto-move human-navigation records.
- Do not auto-create wrappers.
- Do not auto-rewrite references.
- Preserve current navigation files until Jenn or the project owner confirms
  the semantic bucket.
- Split execution into small exact-file packages after decisions exist.

## Non-Authorization

- no file movement
- no wrapper creation
- no reference rewrite
- no validator behavior change
- no provider, plugin, API, image generation, DailyNote, VCP memory, runtime,
  real manifest, VCPChat, or VCPToolBox action
- no push, tag, release, or deploy
