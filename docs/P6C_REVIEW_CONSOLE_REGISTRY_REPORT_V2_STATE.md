# P6C Review Console Registry Report v2 State

## Status

```yaml
phase: p6c_review_console_registry_report_v2_state
status: completed_validated_pending_guarded_local_commit
mode: A4.8_static_review_console
surface: review_console/static_prototype
draft_output_key: registry_report_v2_state
```

P6C connects the formal P6B registry report back into the static Review Console. The console now shows `registry_report_v2_state` as a visible panel and includes it in draft output.

## What It Shows

The static panel exposes:

- `report_version: accepted_failure_capsule_registry_report_v2`
- `status: accepted_failure_capsule_registry_report_v2_verified`
- `accepted=2`
- `failure=2`
- `total=4`
- `passed=4`
- `failed=0`
- per-sample accepted/failure result rows
- resolved-by link:
  - `failure_french_summer_rattan_bag_v7_29_001`
  - `accepted_french_summer_rattan_bucket_bag_001`
  - `failure_tennis_wallet_v7_21_001`
  - `accepted_product_still_life_tennis_wallet_001`
- clean failure class summary

## Boundary

The UI state is derived from existing static capsule mock data and mirrors the formal validator shape. It does not execute the validator in the browser and does not read local files.

P6C does not authorize:

- reading `asset_archive/` from the browser
- loading or rendering `preview.webp`
- creating, copying, or converting preview files
- mutating accepted/failure capsules
- provider/plugin/API calls
- image generation
- DailyNote or VCP memory writes
- runtime integration
- real manifest / VCPChat / VCPToolBox reads
- production candidate creation
- push, tag, release, or deploy

## Validation

Primary validator:

```text
node scripts/validate_review_console_registry_report_v2_state.js
```

The validator checks the static UI, draft output key, snapshot fixture, P6B report link, and hard-stop guard tokens.
