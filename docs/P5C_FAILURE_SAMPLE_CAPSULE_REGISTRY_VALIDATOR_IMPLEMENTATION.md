# P5c Failure Sample Capsule Registry Validator Implementation

base_contract: AGENTS.md
mode: A4.8 local validator implementation
status: completed_validated

## Purpose

Implement the first local validator for the planned failure sample capsule lane
without creating any failure sample capsule and without changing package scripts.

## Implemented Validator

```text
scripts/validate_failure_sample_capsule_registry.js
```

Default behavior:

```yaml
root: asset_archive/failure_samples
mode: archive-directory
required_long_edge: 512
require_at_least: 0
zero_sample_safe: true
```

The current repository has no real failure sample capsules. That is valid for
the default command because the validator is meant to guard the lane before
sample creation is authorized.

## Current Expected Commands

```powershell
node scripts/validate_failure_sample_capsule_registry.js
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
```

Expected current behavior:

- default command: passes with `total_samples=0`
- `--require-at-least=1`: fails closed with `sample_count_below_required_minimum`

## Guarded Scope

This implementation does not:

- create `asset_archive/failure_samples/<sample_id>/`
- create `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json`
- copy, convert, or generate any preview image
- modify accepted sample capsules
- modify `package.json`
- call provider/plugin/API
- write DailyNote or VCP memory
- read runtime, real manifest, VCPChat, or VCPToolBox
- create production candidates
- push, tag, release, or deploy

## Recommended Next

Add negative-case coverage for the failure sample capsule validator under ignored
`.agent_private/`, then decide whether to wire the default zero-sample validator
into `scripts/validate_mvp.ps1`.
