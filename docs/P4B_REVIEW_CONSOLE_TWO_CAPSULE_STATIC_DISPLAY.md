# P4b Review Console Two-Capsule Static Display

base_contract: AGENTS.md
mode: A4.8 static prototype enhancement
status: completed_validated

## Purpose

Update the Review Console static prototype so it can display the current
two-capsule Git-portable accepted sample evidence surface.

## Change

The prototype keeps the original single-object compatibility field:

```text
portable_preview_capsule_evidence
```

It also adds a two-sample static list:

```text
portable_preview_capsule_evidence_list
```

The UI summary now displays:

- total capsule count
- both accepted sample ids
- preview format and long edge from the existing primary capsule field
- clone-portable validation status

## Static Evidence

```yaml
capsules:
  - accepted_french_summer_rattan_bucket_bag_001
  - accepted_product_still_life_tennis_wallet_001
registry_total_samples: 2
registry_passed_count: 2
clone_portable_validation: passed
```

## Boundaries

This update does not:

- read `asset_archive/` files at runtime
- fetch
- write files from the prototype
- create, copy, convert, or generate images
- call provider/plugin/API
- write DailyNote or VCP memory
- read real manifest, VCPChat, or VCPToolBox
- create production candidates
