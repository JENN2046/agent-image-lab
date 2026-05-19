# P6 C2 Validator-Blocked Compatibility Next Steps

base_contract: AGENTS.md
mode: A4.8 docs-only compatibility planning
status: prepared_validated_no_execution

## Purpose

Keep the 423 validator-blocked records in place while defining the exact
compatibility work needed before any archive movement.

## Buckets

```yaml
tests_only_strategy: 34
scripts_only_strategy: 197
scripts_plus_tests_strategy: 192
movement_allowed_now: false
validator_behavior_change_allowed_now: false
```

Source evidence:

```text
docs/archive/DOCS_ARCHIVE_C2A_VALIDATOR_BLOCKED_DEPENDENCY_GRAPH_DRY_RUN.csv
docs/archive/DOCS_ARCHIVE_C2B_VALIDATOR_BLOCKED_STRATEGY_PACKAGE.csv
docs/C2_VALIDATOR_BLOCKED_COMPATIBILITY_DESIGN_DRY_RUN.md
```

## Next Safe Steps

1. Produce a tests-only fixture reference strategy for the 34 test references.
2. Produce a scripts-only reference strategy for the 197 validator references.
3. Produce a combined scripts+tests strategy for the 192 dual references.
4. Only after those packages pass review, prepare exact-file movement packages.

## Stop Conditions

- any candidate lacks an exact current path or exact future archive path
- any validator behavior would change without a separate authorization
- any test fixture reference would break without a rewrite package
- any wrapper would be needed but not explicitly designed
- any physical move is requested without exact-file allowlist

## Non-Authorization

- no file movement
- no wrapper creation
- no reference rewrite
- no validator behavior change
- no provider, plugin, API, image generation, DailyNote, VCP memory, runtime,
  real manifest, VCPChat, or VCPToolBox action
- no push, tag, release, or deploy
