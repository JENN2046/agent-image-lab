# C2b Validator-Blocked Strategy Package

base_contract: AGENTS.md
mode: A4.8 local docs-only strategy package
status: completed_strategy_no_execution

## Scope

Source graph: docs/archive/DOCS_ARCHIVE_C2A_VALIDATOR_BLOCKED_DEPENDENCY_GRAPH_DRY_RUN.csv
Records classified: 423
CSV strategy: docs/archive/DOCS_ARCHIVE_C2B_VALIDATOR_BLOCKED_STRATEGY_PACKAGE.csv

## Strategy Buckets

- fixture_or_test_reference_strategy_required_before_move: 34
- long_term_retain_until_validator_and_test_compatibility_plan: 192
- retain_original_path_until_validator_reference_strategy_exists: 197

## Decision

No validator-blocked record should move in the current C2 pass. All 423 records have live scripts and/or tests references. C2 must proceed by compatibility design, not physical archive movement.

Recommended route:

1. Keep original paths for scripts_and_tests records until both validator and fixture compatibility are designed.
2. For scripts_only records, design an exact validator reference strategy before movement.
3. For tests_only records, design fixture/test reference strategy before movement.
4. Do not create wrappers by default; wrappers are a fallback only after exact compatibility strategy is reviewed.

## Non-Authorization

- no file movement
- no reference rewrite
- no wrapper creation
- no scripts/tests runtime logic change
- no validator behavior change
- no provider/API/plugin/MCP/image generation/.env/real manifest/VCPChat/VCPToolBox/DailyNote/VCP memory/production_candidate/failure_samples action
- no push/tag/release/deploy
