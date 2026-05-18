# v14.231 Git-Tracked Preview Evidence Capsule Baseline

```yaml
phase: v14_231_git_tracked_preview_evidence_capsule_baseline
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: policy_and_schema_baseline_only
```

## Purpose

Record the new durable evidence route after the current computer proved that
old ignored `runs/real_generation/` artifacts are unavailable.

The project should no longer block on restoring old local-only evidence before
it can move forward. The next baseline is a Git-portable evidence capsule for
new accepted samples.

This phase does not create previews, copy images, restore `runs/`, call
providers, call plugins, call APIs, generate images, read VCPChat, read
VCPToolBox, read real manifests, write DailyNote, write VCP memory, stage,
commit, push, tag, release, or deploy.

## Decision

```yaml
old_runs_as_long_term_evidence: false
old_runs_recovery_route: superseded_by_git_tracked_preview_capsule
base64_allowed: false
original_sha256_tracked: false
original_sha256_in_manifest: false
original_required_for_portable_validation: false
preview_webp_required_for_new_accepted_samples: true
preview_long_edge: 512
preview_git_tracked: true
preview_sha256_in_manifest: true
portable_validation_claim: git_portable_preview_evidence
full_original_recoverability_required: false
```

## Capsule Layout

```text
asset_archive/accepted_samples/<sample_id>/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

## Manifest Contract

The manifest must describe the portable preview and the human review chain.
It must not include Base64 payloads or original image hashes.

```yaml
manifest_required_fields:
  sample_id: true
  artifact.preview.path: preview.webp
  artifact.preview.format: webp
  artifact.preview.long_edge: 512
  artifact.preview.sha256: required
  artifact.preview.git_tracked: true
  artifact.original.git_tracked: false
  artifact.original.sha256_in_manifest: false
  chain.import_record: import_record.json
  chain.review_record: review_record.json
  chain.approval_record: approval_record.json
manifest_forbidden_fields:
  - artifact.original.sha256
  - preview_base64
  - thumbnail_base64
  - original_base64
```

## Preview Contract

```yaml
preview_contract:
  file_name: preview.webp
  format: webp
  long_edge: 512
  resize_policy: preserve_aspect_ratio_downscale_to_long_edge_512
  sha256_in_manifest: true
  git_tracked: true
```

The original may remain in external local storage, be regenerated later, or be
lost. It is not required for the Git-portable evidence claim.

## Validator Semantics

```yaml
portable_evidence_verified:
  requires_manifest_json: true
  requires_preview_webp: true
  requires_preview_sha256_match: true
  requires_preview_long_edge_512: true
  requires_import_record: true
  requires_review_record: true
  requires_approval_record: true
full_original_recoverability_required: false
legacy_runs_missing_result: evidence_loss_recorded_do_not_claim_old_full_recoverability
```

The claim changes from old full local artifact recovery to
`git_portable_preview_evidence`. That is a smaller but portable product claim:
after cloning on a new computer, the project can still show the accepted sample
preview and verify its manifest-bound evidence chain.

## Boundary

```yaml
A5_execution: false
provider_contact: false
plugin_call: false
api_call: false
image_generation: false
runs_write: false
DailyNote_write: false
VCP_memory_write: false
runtime_execution: false
real_manifest_read: false
real_vcpchat_read: false
real_vcptoolbox_read: false
push_tag_release_deploy: false
```

## Current Result

```yaml
decision: new_durable_archive_baseline_is_git_tracked_preview_evidence_capsule
copy_performed_now: false
preview_generated_now: false
old_runs_restored_now: false
base64_added_now: false
original_sha256_added_now: false
recommended_next: implement_first_new_sample_capsule_when_source_preview_generation_is_explicitly_authorized
```
