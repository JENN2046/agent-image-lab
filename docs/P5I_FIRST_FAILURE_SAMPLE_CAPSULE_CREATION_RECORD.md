# P5I First Failure Sample Capsule Creation Record

```yaml
phase: p5i_first_failure_sample_capsule_creation
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Record the authorized creation of the first Git-portable failure sample preview capsule.

## Authorized Command

```powershell
node scripts/create_failure_sample_capsule.js --sample-id=failure_french_summer_rattan_bag_v7_29_001 --source-image=runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg --long-edge=512 --confirm-create=true
```

## Created Capsule

```yaml
sample_id: failure_french_summer_rattan_bag_v7_29_001
target_root: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001
created_files:
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/failure_record.json
  - asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/review_record.json
preview:
  format: webp
  width: 512
  height: 512
  long_edge: 512
  sha256: 8addc3084099c1f2aab11a27c7b730f475ced21f80fff0b2e67d877c49d8c43e
```

## Validator Reconciliation

After creation, the creator dry-run validator was reconciled from a pre-creation assumption to a stable post-creation invariant:

```text
old invariant: target directory must be absent
new invariant: plan-only validation must preserve target directory state
```

This keeps the validator useful after the first capsule exists.

## Explicit Non-Execution

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_execution_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```
