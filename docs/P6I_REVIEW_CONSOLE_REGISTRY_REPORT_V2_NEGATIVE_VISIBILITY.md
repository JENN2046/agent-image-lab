# P6I Review Console Registry Report v2 Negative Visibility

## Status

```yaml
phase: p6i_review_console_registry_report_v2_negative_visibility
status: completed_unvalidated
mode: A4.8_static_review_console_negative_visibility
surface: review_console/static_prototype
draft_output_key: registry_report_v2_negative_visibility_state
```

P6I makes the P6G fail-closed negative states visible in the static Review Console instead of leaving them hidden behind a clean totals row.

## What It Shows

The static panel exposes 4 fail-closed classes:

- `accepted_registry_failed`
- `failure_registry_failed`
- `missing_resolved_by_link`
- `production_or_memory_guard_violation`

For each synthetic scenario the panel shows:

- scenario id
- severity
- affected lane
- affected sample ids
- expected report status
- visible reason in Chinese
- reviewer action in Chinese

The draft output now carries:

```text
registry_report_v2_negative_visibility_state
```

## Boundary

The negative-state surface is derived only from static mock data and a golden snapshot. It does not execute the validator in the browser and does not read local capsule files.

P6I does not authorize:

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
node scripts/validate_review_console_registry_report_v2_negative_visibility.js
```

The validator checks the static UI tokens, draft output key, snapshot fixture, P6G source linkage, and hard-stop guard tokens.
