# P5G Failure Sample Capsule Creator Dry Run Implementation

```yaml
phase: p5g_failure_sample_capsule_creator_dry_run_implementation
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Add a dedicated local creator entrypoint for a future failure sample preview capsule while keeping actual capsule creation blocked until a separate execution authorization.

The script is intentionally conservative:

- it supports only `failure_french_summer_rattan_bag_v7_29_001`
- it defaults to plan-only mode
- it writes files only when a future command includes `--confirm-create=true`
- it refuses mismatched `--source-image` and `--long-edge`
- it refuses to overwrite existing capsule files

## New Entry Point

```text
scripts/create_failure_sample_capsule.js
```

Default dry-run command:

```powershell
node scripts/create_failure_sample_capsule.js --sample-id=failure_french_summer_rattan_bag_v7_29_001 --source-image=runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg --long-edge=512
```

Future execution command, if separately authorized:

```powershell
node scripts/create_failure_sample_capsule.js --sample-id=failure_french_summer_rattan_bag_v7_29_001 --source-image=runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg --long-edge=512 --confirm-create=true
```

## Future Write Set

Only the future execution command may write:

```text
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/failure_record.json
asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/review_record.json
```

## Guard

This implementation does not create a failure capsule during this phase.

```yaml
capsule_created_now: false
preview_created_or_copied_now: false
failure_record_written_now: false
review_record_written_now: false
manifest_written_now: false
provider_plugin_api_image_generation_performed: false
DailyNote_or_VCP_memory_write_performed: false
runtime_or_real_manifest_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```

## Validation

Required validation for this implementation:

```powershell
node --check scripts/create_failure_sample_capsule.js
node scripts/create_failure_sample_capsule.js --sample-id=failure_french_summer_rattan_bag_v7_29_001 --source-image=runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg --long-edge=512
node scripts/validate_failure_sample_capsule_registry.js
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

The second command must return `mode: plan_only` and `writes_performed: false`.

## Next Step

The next stage may request explicit authorization to run the future execution command with `--confirm-create=true`. Without that exact authorization, the first failure capsule remains uncreated.
