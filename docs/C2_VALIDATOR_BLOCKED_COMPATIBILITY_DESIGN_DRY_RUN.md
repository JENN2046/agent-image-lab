# C2 Validator-Blocked Compatibility Design Dry Run

base_contract: AGENTS.md
mode: A4.8 local docs-only compatibility design
status: dry_run_only_no_execution

## Purpose

Define the next safe C2 step for 423 validator-blocked archive records without
moving files or changing validator behavior.

## Source Buckets

```yaml
fixture_or_test_reference_strategy_required_before_move: 34
long_term_retain_until_validator_and_test_compatibility_plan: 192
retain_original_path_until_validator_reference_strategy_exists: 197
```

Source evidence:

```text
docs/archive/DOCS_ARCHIVE_C2A_VALIDATOR_BLOCKED_DEPENDENCY_GRAPH_DRY_RUN.csv
docs/archive/DOCS_ARCHIVE_C2B_VALIDATOR_BLOCKED_STRATEGY_PACKAGE.csv
```

## Compatibility Route

1. Keep all 423 original paths in place for now.
2. For tests-only records, design fixture/test reference updates first.
3. For scripts-only records, design validator reference strategy first.
4. For scripts+tests records, require both strategies before movement.
5. Use wrappers only as fallback after exact compatibility review.

## Acceptance Criteria For A Future C2 Execution Gate

- exact candidate list
- exact current source path for every candidate
- exact future archive path for every candidate
- exact script/test references that will change
- proof that validator behavior is unchanged or separately authorized
- rollback plan

## Non-Authorization

- no file movement
- no reference rewrite
- no wrapper creation
- no validator behavior change
- no script/test runtime logic change
- no provider/API/plugin/MCP/image generation/.env/real manifest/VCPChat/VCPToolBox/DailyNote/VCP memory action
- no push/tag/release/deploy
