# Capsule Creator Review Hardening Closeout

## Status

`completed_validated_pending_commit`.

This closeout addresses the immediate code-review hardening lane after capsule contract productization.

## Scope

- Make accepted preview capsule creation plan-only by default.
- Require `--confirm-create=true` before accepted capsule writes.
- Keep temp-dir then final rename behavior for confirmed accepted capsule creation.
- Block existing accepted/failure target directories instead of allowing `.gitkeep` placeholders.
- Strengthen accepted manifest guard parity with failure capsule manifests.
- Add short PNG dimension fail-closed handling for artifact recoverability validation.
- Document `sharp` as local preview WebP tooling only.

## Changed behavior

- `npm run create-preview-capsule` is now a safe plan-only command.
- `npm run create-preview-capsule:confirmed` passes explicit `--confirm-create=true`.
- `scripts/create_preview_capsule.js` returns a plan object by default and performs no writes unless confirmed.
- Accepted and failure capsule creators now fail closed when the target capsule directory already exists.
- Accepted manifests now declare production, memory, DailyNote, VCP memory, and commercial delivery guard fields as false.
- Manifest contract validation enforces the stronger accepted guard fields.
- `readPngDimensions()` returns invalid/null dimensions for short PNG buffers instead of throwing.

## Validation

Validated:

- `node --check scripts\create_preview_capsule.js`
- `node --check scripts\create_failure_sample_capsule.js`
- `node --check scripts\lib\capsule_manifest_contract.js`
- `node --check scripts\lib\artifact_recoverability_core.js`
- `node --check scripts\validate_artifact_recoverability_core_image_safety.js`
- `node scripts\validate_create_preview_capsule_registry_source.js`
- `node scripts\validate_capsule_manifest_contract.js`
- `node scripts\validate_capsule_manifest_contract_negative_cases.js`
- `node scripts\validate_preview_capsule_registry.js`
- `node scripts\validate_failure_sample_capsule_registry.js`
- `node scripts\validate_capsule_registry_report_v2.js`
- `node scripts\validate_capsule_registry_report_v2_negative_states.js`
- `node scripts\validate_review_console_registry_report_v2_negative_visibility.js`
- `node scripts\validate_review_console_unified_capsule_contract.js`

Pending final closeout validation:

- `git diff --check`
- `node scripts\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1`

## Not performed

- No provider contact.
- No plugin call.
- No API call.
- No image generation.
- No DailyNote write.
- No VCP memory write.
- No runtime execution.
- No real manifest read.
- No real VCPChat or VCPToolBox read.
- No `runs/` mutation.
- No preview binary creation, copy, or conversion.
- No production candidate.
- No tag, release, or deploy.

## Remaining review items

- `P1-4` YAML parser replacement is intentionally not implemented here because adding a YAML parser would change dependencies.
- `P2-2` schema-as-runtime-validation remains a follow-up; current validation still uses JS shape and relation rules.
- `P2-3` split baseline/general validators remains a follow-up.

## Recommended next

Run final local validation, then exact-file stage and create a guarded local commit if still clean.
