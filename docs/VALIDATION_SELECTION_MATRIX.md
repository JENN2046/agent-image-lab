# Validation Selection Matrix

```yaml
matrix_id: validation_selection_matrix
scope: Agent Image Lab A4.8
purpose: choose the narrowest validation that proves the current local change
```

## Common Baseline

Every modification requires:

```text
git status -sb
git diff --check
exact diff review
```

## Matrix

| Change Type | Required Validation | Notes |
|---|---|---|
| Docs-only planning | `git diff --check` | No runtime or provider checks. |
| README / roadmap / PROJECT_MASTER_PLAN | `powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1`; `powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1` | Use when status surfaces change. |
| `.agent_board` resume surfaces | `node scripts/validate_agent_board_state.js` | Also check handoff, run state, task queue, checkpoint, validation log freshness. |
| Validation manifest / recommender tooling | `npm run validate:recommendation-profiles`; `node scripts/benchmark_validation_efficiency.js --no-write --iterations=1` | Proves `recommended_validation_profile`, `validation_plan`, manifest coverage, and benchmark observability without writing a new report. |
| `package.json` validation script wiring | `npm run validate:active` | Daily profile aggregate; covers smoke, validation manifest, recommendation profile contract, MVP, and active runtime/review gates. |
| `reports/validation_benchmarks/**` | `node scripts/benchmark_validation_efficiency.js --no-write --iterations=1` | Observability profile; validates benchmark parsing without changing reports. |
| Current state alignment | `node scripts/validate_current_state_alignment.js` | Use when current status or recommended next changes. |
| Native Doubao sandbox surfaces | `node scripts/validate_native_doubao_sandbox.js` | Safe static validator only; no generation runner. |
| JavaScript file changed | `node --check <changed-js-file>` | Syntax check only unless task authorizes more. |
| PowerShell helper changed | Parse/run the changed helper when safe | Do not read secrets or run provider/runtime. |
| Static Review Surface docs/spec | Docs checks plus no-execution review | No renderer/preload/IPC/runtime unless explicitly authorized. |

## Recommender Output Contract

`npm run recommend:validation` is the default tool for converting changed files
into a validation plan. Consumers should treat these fields as the durable
contract:

```text
recommendation_contract_version
recommended_validation_profile.primary_profile
recommended_validation_profile.primary_command
recommended_validation_profile.profile_catalog
validation_plan.execution_commands
validation_plan.covered_commands
validation_plan.covered_profiles
validation_plan.deferred_commands
efficiency_summary
validation_decision_summary
manifest_coverage
change_selection.source
change_selection.tracked_diff_file_count
change_selection.untracked_file_count
change_selection.explicit_file_count
```

For closeout surfaces that only need runnable commands, use:

```text
npm run recommend:validation:next-commands
node scripts/recommend_validation_for_changed_files.js --next-commands=json
```

The npm entry emits one command per line from
`validation_decision_summary.next_commands`. The JSON-lite form keeps
`primary_profile`, `primary_command`, `next_commands`, and `deferred_commands`
without requiring consumers to parse the full recommender payload.

Change selection modes:

| Source | How Files Are Selected | Use |
|---|---|---|
| `git_diff_worktree` | Default mode. Combines tracked worktree diff with untracked non-ignored files so new benchmark reports and new validators are not missed. | Normal local closeout and pre-commit recommendation. |
| `git_diff_cached` | `--cached` mode. Uses only staged files and intentionally excludes untracked files. | Exact-file staging or commit readiness checks. |
| `git_diff_base` | `--base <ref>` mode. Compares against a base ref and still includes untracked non-ignored files from the current worktree. | Branch/base review when local new files also need validation. |
| `argv` | Explicit `--files` or positional file list. | Targeted spot checks and validator fixtures. |

`change_selection` also reports `tracked_diff_files`, `untracked_files`, and
`explicit_file_list` so closeout reports can explain why a command was selected
without re-running Git discovery by hand.

## Daily Closeout Consumption

For normal local closeout, run `npm run recommend:validation` before selecting
validation manually. Treat `validation_decision_summary.next_commands` as the
first validation plan to consider, then report those commands in closeout.

If the closeout uses different commands, record whether the recommendation was
broadened for shared-risk coverage, narrowed for a targeted spot check, deferred
to an archive/governance entrypoint, or skipped because the task was read-only
and no changed-file recommendation applied.

Profile meanings:

| Profile | Primary Use | Command |
|---|---|---|
| `daily` | Daily mainline validation when validation entrypoint wiring can drift. | `npm run validate:active` |
| `observability` | Benchmark/report/tooling changes that should prove no-write observability. | `node scripts/benchmark_validation_efficiency.js --no-write --iterations=1` |
| `mvp` | Product-core or review-console changes that need MVP coverage without full governance. | `npm run validate:mvp` |
| `targeted` | Narrow file-specific validation when no aggregate profile is triggered. | `npm run validate:targeted-plan` plus `recommended_commands` |

Legacy compatibility:

```text
active_recommended
mvp_recommended
validate_active_command
validate_mvp_command
```

These top-level fields remain compatibility aliases for older readers. New
consumers should not branch primarily on them; use
`recommended_validation_profile` and `validation_plan` instead.

## Validation Selection Rule

Use the narrowest validation set that proves the changed surface. Add broader validation only when the task touches shared status surfaces, validators, or project gates.

Do not run real generation, provider contact, plugin call, `.env.local` value read, runtime integration, or memory write as validation under A4.8.
