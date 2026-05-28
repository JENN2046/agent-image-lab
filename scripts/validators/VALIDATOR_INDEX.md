# Validator Index

Status: active validator discovery index
Authority: `docs/REPOSITORY_ORGANIZATION_STANDARD.md`
Mode: Green Lane structure governance

This index makes the current validator surface discoverable before any broad
movement. It does not authorize moving old validators, deleting validators,
changing package scripts, running provider/plugin/API/image/memory/production
actions, commit, push, tag, release, deploy, or destructive filesystem actions.

## Current Snapshot

Root-level JavaScript validators are still the compatibility surface:

```text
root_validator_total: 570
```

Current root validator buckets:

| Bucket | Count | Matching rule | Governance note |
| --- | ---: | --- | --- |
| `legacy_versioned` | 289 | `validate_v<digit>*` | Historical phase validators. Do not move without wrappers and reference maps. |
| `other` | 181 | fallback | Mixed legacy validators. Classify before moving. |
| `readonly_visual_review` | 21 | `validate_visual_eval_readonly_*` | Candidate for a future readonly visual review domain index. |
| `runtime` | 21 | `validate_runtime_*`, `validate_durable_*`, `validate_review_bridge*` | Runtime-adjacent; preserve A5/runtime boundaries. |
| `capsule` | 16 | `validate_capsule_*`, `validate_preview_*` | Capsule/product evidence validators. |
| `provider_preflight` | 14 | `validate_exact_a5*`, `validate_provider*`, `validate_retry*` | Provider/A5 preflight and receipt validators; do not mix with side-effect runners. |
| `autopilot_governance` | 12 | `validate_autopilot*`, `validate_agent_board*`, `validate_smart*` | Governance and resume-surface validators. |
| `review_console` | 9 | `validate_review_console*` | Review Console validators. |
| `visual_eval` | 6 | `validate_visual_eval_*` excluding readonly | Visual evaluation protocol validators. |
| `readonly_operator_console` | 1 | `validate_readonly_operator_console*` | Dedicated operator console static validator. |

## Current Splits

Current physical splits:

```text
scripts/validators/governance/validate_repository_structure_governance.js
scripts/validators/readonly_operator_console/validate_readonly_operator_console_static_surface.js
```

Stable root compatibility wrappers:

```text
scripts/validate_repository_structure_governance.js
scripts/validate_readonly_operator_console_static_surface.js
```

## Rules For Future Splits

- Move one family at a time.
- Keep the old root path as a wrapper until all references are mapped.
- Update this index in the same slice as any validator family split.
- Extend `scripts/validators/governance/validate_repository_structure_governance.js`
  when the index gains a new protected invariant.
- Do not move runtime-adjacent or provider-adjacent validators in the same
  slice as side-effect runners.
- Do not change `package.json` scripts unless the task explicitly targets the
  command surface.

## Recommended Next Families

1. `review_console`: bounded static prototype and review-console validators.
2. `readonly_visual_review`: coherent readonly artifact-chain validators.
3. `autopilot_governance`: governance validators, but only after checking
   `.agent_board` historical assumptions.

`legacy_versioned`, `other`, `runtime`, and `provider_preflight` need deeper
reference maps before physical movement.
