# Full Asset Archive Design

```yaml
gate_template:
  phase: full_asset_archive_design_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_actions:
    - local docs design
    - schema planning
  forbidden_actions:
    - copy original image binaries
    - read runs/source image binaries
    - extract new hash or dimensions
    - generate preview
    - write production_candidate
    - call provider/plugin/API
    - write DailyNote or VCP memory
```

## Decision

Agent Image Lab keeps two asset evidence layers:

```yaml
preview_capsule_layer:
  purpose: Git-portable review and validation evidence
  storage: asset_archive/accepted_samples/<sample_id>/
  git_tracked: true
  required_files:
    - manifest.json
    - preview.webp
    - import_record.json
    - review_record.json
    - approval_record.json
  validation_claim: portable_preview_evidence

original_asset_layer:
  purpose: full-quality production and future delivery evidence
  storage: outside Git by default
  git_tracked: false
  required_for_portable_validation: false
  validation_claim: blocked_until_A5_real_asset_verification
```

The original asset does not enter Git by default. Git stores the reviewable
preview capsule plus a manifest that can later bind to an original asset
verification record after explicit A5 authorization.

## Preview And Original Binding

The binding is manifest-led, not filename-led.

```yaml
binding_model:
  sample_id: stable product identity
  preview_manifest: asset_archive/accepted_samples/<sample_id>/manifest.json
  preview_artifact:
    path: preview.webp
    sha256: required
    dimensions: required for Git-tracked preview validation
    git_tracked: true
  original_artifact:
    storage_ref: nullable until A5 verification
    sha256: nullable until A5 verification
    dimensions: nullable until A5 verification
    mime: nullable until A5 verification
    verified_at: nullable until A5 verification
    required_for_portable_validation: false
```

After clone, the project can still verify the preview capsule. It must not claim
full original recoverability unless the original asset verification record is
present and current.

## Archive Manifest Shape

The next schema should describe a full asset archive candidate without requiring
the original binary to be present:

```yaml
full_asset_archive_manifest:
  version: v1
  manifest_type: full_asset_archive_manifest
  sample_id: string
  lane: accepted | failure
  preview_capsule_ref: project_relative_path
  preview_validation:
    preview_sha256: sha256
    preview_long_edge: integer
    preview_git_tracked: true
  original_asset:
    storage_strategy: external_local | external_cloud | missing | not_yet_verified
    storage_ref: null_or_project_relative_or_redacted_external_ref
    sha256: null_or_sha256
    dimensions: null_or_widthxheight
    mime: null_or_image_mime
    verification_status: blocked | missing | verified
  guards:
    production_candidate_allowed: false
    memory_write_allowed: false
    DailyNote_write_allowed: false
    VCP_memory_write_allowed: false
    commercial_delivery_allowed: false
```

## Hash And Dimensions Rule

```yaml
allowed_now:
  - existing Git-tracked preview static validation

blocked_without_A5:
  - runs/source image binary read
  - original image sha256 extraction
  - original image dimensions extraction
  - preview generation
  - original copy into asset_archive
```

Existing preview validators may continue to verify checked-in `preview.webp`
hash and dimensions. New original hash/dim extraction requires an A5 package
naming exact paths, max path count, allowed reads, output report, and stop
conditions.

## Failure Semantics

```yaml
fail_closed_cases:
  missing_preview_capsule: block_archive_manifest
  preview_hash_mismatch: block_archive_manifest
  original_storage_ref_present_but_unverified: original_status_blocked
  original_missing_after_previous_verification: original_status_missing
  absolute_or_secret_path_in_manifest: fail
  production_candidate_requested_before_original_verification: fail
```

A missing original does not invalidate the Git-portable preview capsule. It does
block full asset archive readiness and production candidate preflight.

## Recovery Semantics

```yaml
clone_recovery:
  preview_capsule: recoverable_from_git
  original_asset: not_recoverable_from_git_by_default
  user_action: provide A5 authorization for exact original paths
  validator_behavior: report blocked_or_missing_original_without_mutating_files
```

## Next Schema Gate

```yaml
next_phase: full_asset_archive_manifest_schema_gate
deliverables:
  - schemas/full_asset_archive_manifest.schema.yaml
  - tests/schema_examples/full_asset_archive_manifest.example.json
  - scripts/validate_full_asset_archive_manifest.js
non_authorization:
  image_binary_read: false
  preview_generation: false
  original_copy: false
  production_candidate: false
```
