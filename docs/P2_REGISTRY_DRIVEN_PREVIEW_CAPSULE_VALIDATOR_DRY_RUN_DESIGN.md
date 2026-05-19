# P2 Registry-Driven Preview Capsule Validator Dry Run Design

```yaml
phase: p2_registry_driven_preview_capsule_validator_dry_run_design
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
status: design_package_completed_p2a_implementation_completed_validated
```

## Purpose

Move the preview capsule verification path from a single `--sample-id` proof toward a registry-driven validator design.

Current proven capability:

```text
scripts/validate_preview_capsule.js --sample-id=accepted_french_summer_rattan_bucket_bag_001
```

Target design:

```text
asset_archive/accepted_samples/
  <sample_id>/
    manifest.json
    preview.webp
    import_record.json
    review_record.json
    approval_record.json

registry-driven validator
  -> discover expected sample ids
  -> validate each capsule with the same core rules
  -> emit per-sample report
  -> fail if required capsule evidence is missing or malformed
```

## Non-Authorization

This package does not authorize:

```text
preview.webp creation
preview.webp copy
image conversion
image generation
provider contact
plugin call
API call
DailyNote write
VCP memory write
runtime integration
real manifest read
VCPChat read
VCPToolBox read
production candidate creation
tag
release
deploy
push
```

It also does not move, delete, or rewrite existing capsule files.

## Current Inputs

Existing single capsule:

```yaml
sample_id: accepted_french_summer_rattan_bucket_bag_001
capsule_root: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/
preview_long_edge: 512
preview_sha256: 455bbbc5be93b68f7eb02287ac6d861d1b2397a0f5d793d58ea7ab670f8d6cb3
validator: scripts/validate_preview_capsule.js
core: scripts/lib/artifact_recoverability_core.js
```

Potential registry sources:

```yaml
preferred_registry_surface:
  path: asset_archive/accepted_samples/
  method: discover child directories containing manifest.json
  reason: directly reflects Git-portable capsule inventory

secondary_registry_surface:
  path: accepted_samples/accepted_sample_registry.yaml
  method: parse accepted sample ids, then check whether matching capsule exists
  reason: product registry may contain accepted samples that still lack Git-portable capsules
```

P2 dry-run should start with the preferred registry surface because it avoids needing a new YAML parser and validates the actual portable capsule inventory.

## Proposed Validator Contract

New validator:

```text
scripts/validate_preview_capsule_registry.js
```

Initial options:

```text
--root=asset_archive/accepted_samples
--long-edge=512
--require-at-least=1
--mode=archive-directory
```

Output shape:

```json
{
  "passed": true,
  "status": "registry_driven_preview_capsules_verified",
  "root": "asset_archive/accepted_samples",
  "mode": "archive-directory",
  "sample_count": 1,
  "passed_count": 1,
  "failed_count": 0,
  "samples": [
    {
      "sample_id": "accepted_french_summer_rattan_bucket_bag_001",
      "passed": true,
      "preview_sha256": "455bbbc5be93b68f7eb02287ac6d861d1b2397a0f5d793d58ea7ab670f8d6cb3",
      "preview_width": 512,
      "preview_height": 512,
      "preview_long_edge": 512
    }
  ],
  "failures": []
}
```

## Required Rules

The registry-driven validator must:

```yaml
rules:
  - reuse createRecoverabilityCore(process.cwd())
  - call validatePreviewCapsule(sampleId, { requiredLongEdge: 512 }) for each discovered sample
  - ignore .gitkeep and README.md in asset_archive/accepted_samples/
  - require manifest.json for each counted sample directory
  - fail when no sample directories are found
  - fail when any sample capsule fails validation
  - report per-sample failures without stopping at the first failure
  - avoid reading old runs/ source images
  - avoid creating or modifying preview.webp
  - avoid provider/plugin/API/runtime/memory behavior
```

## Negative Cases For Later Implementation

The implementation validator should cover these local fixture scenarios without modifying real capsules:

```yaml
negative_cases:
  empty_registry_fails:
    setup: temp accepted_samples root with no sample directory
    expected: passed false
  missing_manifest_fails:
    setup: sample directory without manifest.json
    expected: passed false
  missing_preview_fails:
    setup: manifest exists but preview.webp missing
    expected: passed false
  hash_mismatch_fails:
    setup: manifest sha256 does not match preview.webp
    expected: passed false
  wrong_long_edge_fails:
    setup: preview dimensions do not satisfy long_edge 512
    expected: passed false
```

## Implementation Boundary For P2a

P2a may implement:

```text
scripts/validate_preview_capsule_registry.js
tests/schema_examples/p2_registry_driven_preview_capsule_validator.expected.json
README or asset_archive/accepted_samples/README.md command note
.agent_board status sync
```

P2a must not implement:

```text
new preview.webp creation
new accepted sample capsule
old runs restoration
Base64 storage
original image sha256 requirement
provider/plugin/API/image generation
DailyNote/VCP memory/runtime integration
VCPChat/VCPToolBox source reads
push/tag/release/deploy
```

## Validation Plan

P2a should run:

```powershell
node --check scripts/validate_preview_capsule_registry.js
node scripts/validate_preview_capsule_registry.js
npm run validate-preview-capsule -- --sample-id=accepted_french_summer_rattan_bucket_bag_001
git diff --check
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Decision

```yaml
decision:
  p2a_implementation_completed: true
  p2a_validation_passed: true
  implemented_validator: scripts/validate_preview_capsule_registry.js
  recommended_next: exact_file_local_commit_readiness_for_p2a_registry_validator
  implementation_risk: low_to_medium
  product_value: converts single-capsule proof into multi-capsule verification rail
  first_implementation_mode: archive-directory inventory
  yaml_registry_mode: later
  push_required_now: false
  a5_required_now: false
```
