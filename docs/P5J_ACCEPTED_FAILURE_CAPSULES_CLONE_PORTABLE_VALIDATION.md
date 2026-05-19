# P5J Accepted + Failure Capsules Clone-Portable Validation

```yaml
phase: p5j_accepted_failure_capsules_clone_portable_validation
base_contract: AGENTS.md
mode: A4.8
intent: local_validation
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Prove the current Git-tracked portable evidence surface can validate from a clean local Git clone without relying on the old ignored source image.

Validated surface:

- 2 accepted preview capsules under `asset_archive/accepted_samples/`
- 1 failure preview capsule under `asset_archive/failure_samples/`

## Clean Clone Method

```yaml
clone_method: local_git_clone_no_hardlinks
clone_root_class: .agent_private
dependency_restore: npm ci
source_head: 1d7feac9ea39945fad050d445b615cb88da828ae
worktree_status_in_clone: clean
remote_action_performed: false
```

The earlier `git archive` smoke check was useful for file portability, but it
does not preserve `.git` metadata. The final validation used a local Git clone
because `scripts/validate_mvp.ps1` includes Git-state checks.

## Source Image Absence

The old ignored source image was absent in the clean clone:

```text
runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg
```

Result:

```yaml
old_failure_source_image_present_in_clean_clone: false
failure_capsule_valid_without_old_source_image: true
```

## Validation Results

```yaml
accepted_preview_capsules:
  command: npm run validate-preview-capsule-registry
  total_samples: 2
  passed_count: 2
  failed_count: 0

accepted_preview_negative_cases:
  command: npm run validate-preview-capsule-negative-cases
  passed: true

failure_preview_capsules:
  command: node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
  total_samples: 1
  passed_count: 1
  failed_count: 0
  sample_id: failure_french_summer_rattan_bag_v7_29_001
  preview_sha256: 8addc3084099c1f2aab11a27c7b730f475ced21f80fff0b2e67d877c49d8c43e

failure_preview_negative_cases:
  command: node scripts/validate_failure_sample_capsule_registry_negative_cases.js
  passed: true

failure_creator_dry_run:
  command: node scripts/validate_failure_sample_capsule_creator_dry_run.js
  passed: true
  source_image_exists: false
  target_capsule_exists: true
  confirm_create_executed: false
  writes_performed: false

mvp_validation:
  command: powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
  passed: true
```

## Guard

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
preview_creation_or_copy_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_execution_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```

## Result

```yaml
clone_portable_accepted_capsules_verified: true
clone_portable_failure_capsules_verified: true
old_runs_source_required_for_validation: false
validated_capsule_counts:
  accepted: 2
  failure: 1
recommended_next: review_console_static_failure_capsule_display
```
