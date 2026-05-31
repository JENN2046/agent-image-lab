# Runtime To Review V1 Output Extension Normalization Patch - 2026-05-31

```yaml
phase: runtime_to_review_v1_output_extension_normalization_patch_20260531
base_contract: AGENTS.md
lane: Green local runtime/tooling patch
status: completed_pending_validation
source_watchpoint: reports/runtime_to_review_v1/guarded_live_probe_human_visual_review_20260531.json
```

## Purpose

Fix the runtime/tooling gap where a provider output could contain JPEG bytes while retaining a `.png` path. The patch keeps historical artifacts unchanged, but normalizes future output paths during runtime metadata inspection.

## Change

The following runtime output inspectors now derive the canonical extension from `sharp(...).metadata().format`:

- `adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js`
- `adapters/runtime/native_doubao_runtime_v1_vcptoolbox_route_owner_runtime.js`
- `adapters/runtime/native_doubao_runtime_v1_provider_delegate.js`

If the observed format and path extension differ, the file is renamed before metadata is returned:

```yaml
jpeg_or_jpg: .jpg
png: .png
webp: .webp
```

The returned output metadata includes `extension_normalized_from` when a rename occurs. Existing target files are never overwritten; a collision fails closed.

## Boundary

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
historical_artifact_renamed: false
```

## Validation

```powershell
node scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js
node scripts/validate_runtime_to_review_v1_vcptoolbox_route_owner_runtime_module.js
node scripts/validate_runtime_to_review_v1_native_doubao_delegate_module.js
npm run validate:mvp
```

## Next

Future live generations should produce review metadata whose path extension matches observed MIME/magic. The existing 2026-05-31 smoke artifact remains a valid historical watchpoint and is not renamed by this patch.
