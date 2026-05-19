# P6F Accepted / Failure 2x2 Clone-Portable Baseline

```yaml
phase: p6f_accepted_failure_2x2_clone_portable_baseline
base_contract: AGENTS.md
mode: A4.8
intent: local_validation_checkpoint
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Freeze the current Git-portable capsule baseline at:

```yaml
accepted_capsules: 2
failure_capsules: 2
total_capsules: 4
third_failure_capsule_planned_now: false
third_accepted_capsule_planned_now: false
```

This checkpoint intentionally stops sample-count expansion for now. The next product-mainline work should improve validation, reporting, Review Console clarity, and eventual A5 authorization readiness rather than creating a third capsule.

## Clean Clone Validation

Validation was performed from a fresh local clone under `.agent_private/`, using the current local `HEAD` as the source repository.

```yaml
source_head: 07ff0055235adb508ff16f1da3fbd29a7e24a52e
clone_type: local_git_clone_no_hardlinks
dependency_restore: npm ci
old_runs_source_required_for_portable_validation: false
old_runs_source_used_as_portable_evidence: false
```

The clean clone validation passed:

```text
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=2
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_capsule_registry_report_v2.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Verified Capsule Baseline

Accepted capsules:

```yaml
accepted:
  - accepted_french_summer_rattan_bucket_bag_001
  - accepted_product_still_life_tennis_wallet_001
```

Failure capsules:

```yaml
failure:
  - failure_french_summer_rattan_bag_v7_29_001
  - failure_tennis_wallet_v7_21_001
```

Resolved-by links:

```yaml
resolved_by_links:
  - failure_french_summer_rattan_bag_v7_29_001 -> accepted_french_summer_rattan_bucket_bag_001
  - failure_tennis_wallet_v7_21_001 -> accepted_product_still_life_tennis_wallet_001
```

## Explicit No-Third Decision

```yaml
third_capsule_decision:
  create_third_failure_capsule_now: false
  create_third_accepted_capsule_now: false
  reason: current 2x2 baseline is enough to prove accepted/failure portable evidence and resolved-by reporting
  future_change_requires_separate_authorization: true
```

## Boundaries

Not performed:

- no provider contact
- no plugin call
- no API call
- no image generation
- no new preview conversion
- no new capsule creation
- no DailyNote write
- no VCP memory write
- no runtime execution
- no real manifest read
- no VCPChat or VCPToolBox read
- no production candidate creation
- no push, tag, release, or deploy

## Recommended Next

Recommended next local task:

```yaml
recommended_next:
  phase: registry_report_v2_negative_state_design
  purpose: make the accepted/failure report fail closed with clearer per-sample failure classes and no sample-count expansion
  third_capsule_creation: blocked_by_policy_until_separately_authorized
```
