# Docs Archive C1af Package Split Decision

Status: C1af package split decision completed.

Input verifier review: `docs/archive/DOCS_ARCHIVE_C1AE_PAIRED_PACKAGE_VERIFIER_REVIEW.md`

Machine-readable split: `docs/archive/DOCS_ARCHIVE_C1AF_PACKAGE_SPLIT_DECISION.csv`

## Split Rules

- Keep future execution batches at or below 20 moves.
- Keep future execution batches at or below 50 rewrite hits.
- Human-navigation batches remain dry-run only unless Jenn explicitly decides their semantics.
- No batch is executed by this phase.

## Batch Summary

| Batch | Risk bucket | Records | Moves | Rewrite hits | Recommendation |
| --- | --- | ---: | ---: | ---: | --- |
| `agent-board-only-01` | agent_board_only | 20 | 20 | 20 | eligible_for_future_small_exact_execution_package_after_approval |
| `agent-board-only-02` | agent_board_only | 20 | 20 | 31 | eligible_for_future_small_exact_execution_package_after_approval |
| `agent-board-only-03` | agent_board_only | 20 | 20 | 29 | eligible_for_future_small_exact_execution_package_after_approval |
| `agent-board-only-04` | agent_board_only | 20 | 20 | 20 | eligible_for_future_small_exact_execution_package_after_approval |
| `agent-board-only-05` | agent_board_only | 13 | 13 | 13 | eligible_for_future_small_exact_execution_package_after_approval |
| `agent-board-plus-docs-01` | agent_board_plus_docs | 12 | 12 | 47 | dry_run_first_then_possible_small_exact_execution_package |
| `agent-board-plus-docs-02` | agent_board_plus_docs | 12 | 12 | 49 | dry_run_first_then_possible_small_exact_execution_package |
| `agent-board-plus-docs-03` | agent_board_plus_docs | 19 | 19 | 47 | dry_run_first_then_possible_small_exact_execution_package |
| `agent-board-plus-docs-04` | agent_board_plus_docs | 20 | 20 | 44 | dry_run_first_then_possible_small_exact_execution_package |
| `agent-board-plus-docs-05` | agent_board_plus_docs | 5 | 5 | 15 | dry_run_first_then_possible_small_exact_execution_package |
| `human-navigation-01` | human_navigation | 3 | 3 | 45 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-02` | human_navigation | 3 | 3 | 47 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-03` | human_navigation | 3 | 3 | 45 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-04` | human_navigation | 3 | 3 | 45 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-05` | human_navigation | 3 | 3 | 46 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-06` | human_navigation | 3 | 3 | 45 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-07` | human_navigation | 3 | 3 | 42 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-08` | human_navigation | 4 | 4 | 40 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-09` | human_navigation | 4 | 4 | 49 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-10` | human_navigation | 7 | 7 | 48 | dry_run_only_requires_semantic_review_or_jenn_decision |
| `human-navigation-11` | human_navigation | 3 | 3 | 40 | dry_run_only_requires_semantic_review_or_jenn_decision |

## Commander Decision

Future execution should start with agent-board-only batches because they carry the lowest navigation risk. Human-navigation batches should not execute without a semantic decision.

## Non-Execution

This split decision does not move files, rewrite references, create wrappers, or authorize push.
