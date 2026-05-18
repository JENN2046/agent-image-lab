# C1an Human-Navigation Decision Package

base_contract: AGENTS.md
mode: A4.8 local docs-only decision package
status: dry_run_only_no_execution

## Scope

Remaining human-navigation batches: 11
Remaining records: 39
Planned rewrite hits from C1af: 492

## Decision

All remaining human-navigation records are blocked from automatic physical move/rewrite execution for now. They require semantic review because their references may affect current entrypoints, reader navigation, or route explanation surfaces.

## Buckets

- Can paired move/rewrite now: 0
- Should retain current entrypoint now: pending semantic review
- Needs wrapper now: pending semantic review; no wrapper creation authorized by this package
- Needs Jenn裁决: all rows listed in the CSV package

## Evidence

- CSV decision package: `docs/archive/DOCS_ARCHIVE_C1AN_HUMAN_NAVIGATION_DECISION_PACKAGE.csv`
- Source split: `docs/archive/DOCS_ARCHIVE_C1AF_PACKAGE_SPLIT_DECISION.csv`

## Non-Authorization

- no file movement
- no reference rewrite
- no wrapper creation
- no validator behavior change
- no provider/API/plugin/MCP/image generation/.env/real manifest/VCPChat/VCPToolBox/DailyNote/VCP memory/production_candidate/failure_samples action
- no push/tag/release/deploy
