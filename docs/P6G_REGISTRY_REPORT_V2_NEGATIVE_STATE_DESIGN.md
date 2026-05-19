# P6G Registry Report v2 Negative-State Design

```yaml
phase: p6g_registry_report_v2_negative_state_design
base_contract: AGENTS.md
mode: A4.8
intent: local_validation_design
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Strengthen `accepted_failure_capsule_registry_report_v2` so it is not only green-path reporting. P6G defines and validates how report v2 must fail closed when accepted or failure capsule inputs are broken.

This phase does not create a third capsule and does not mutate existing capsule files.

## Baseline

```yaml
accepted_capsules: 2
failure_capsules: 2
total_capsules: 4
third_capsule_creation: blocked
```

## Negative State Classes

The report must preserve and summarize these negative classes:

```yaml
negative_state_classes:
  - accepted_registry_failed
  - failure_registry_failed
  - missing_resolved_by_link
  - missing_chain_file
  - preview_hash_mismatch
  - production_or_memory_guard_violation
```

## Required Behavior

```yaml
required_behavior:
  accepted_registry_failure:
    report_passed: false
    report_failures_include: accepted_registry_failed
    summary_field: accepted_failed
  failure_registry_failure:
    report_passed: false
    report_failures_include: failure_registry_failed
    summary_fields:
      - failure_failed
      - missing_chain_file
      - preview_hash_mismatch
  missing_resolved_by_link:
    report_passed: false
    relation_status: missing_accepted_capsule
    report_failures_include: missing_resolved_by_link:<sample_id>
    summary_field: missing_resolved_by_link
  production_or_memory_guard_violation:
    report_passed: false
    summary_fields:
      - production_or_memory_guard_violation
      - failure_failed
```

## Validator

P6G adds:

```text
scripts/validate_capsule_registry_report_v2_negative_states.js
tests/schema_examples/P6G_REGISTRY_REPORT_V2_NEGATIVE_STATES.example.json
```

The validator uses synthetic accepted/failure registry reports and the real report builder. It does not edit real capsules and does not create new preview assets.

## Boundaries

Not performed:

- no third accepted capsule
- no third failure capsule
- no provider contact
- no plugin call
- no API call
- no image generation
- no preview creation or conversion
- no real capsule mutation
- no DailyNote write
- no VCP memory write
- no runtime execution
- no real manifest read
- no VCPChat or VCPToolBox read
- no production candidate creation
- no push, tag, release, or deploy

## Recommended Next

```yaml
recommended_next:
  phase: review_console_negative_state_visibility_design
  purpose: decide how Review Console should display report v2 failure classes without reading asset_archive or runtime
  sample_count_expansion: false
```
