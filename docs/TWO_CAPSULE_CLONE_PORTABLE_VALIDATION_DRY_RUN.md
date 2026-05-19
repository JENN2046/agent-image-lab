# Two-Capsule Clone-Portable Validation Dry Run

base_contract: AGENTS.md
mode: A4.8 local validation dry-run
status: completed_validated

## Purpose

Validate that the current two Git-portable accepted preview capsules can be
recovered from a clean local checkout without relying on the ignored original
`runs/real_generation/.../*.jpg` source images or the current workspace
`node_modules/`.

## Scope

Validated samples:

- `accepted_french_summer_rattan_bucket_bag_001`
- `accepted_product_still_life_tennis_wallet_001`

Validated capsule root:

```text
asset_archive/accepted_samples/
```

## Clean Checkout Method

```yaml
source_head: 685afc6b3ee8e4acb77de9d3ecd918f71dd8e3c0
clean_checkout_root_class: .agent_private
checkout_method: git clone --local --no-hardlinks
workspace_node_modules_reused: false
dependency_restore: npm ci
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
push_tag_release_deploy_performed: false
```

The clean checkout contains some tracked `runs/` placeholders and historical
support records, but the original source images required to create the two
capsules are absent:

```yaml
old_source_images_absent:
  - runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg
  - runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg
```

This means the validation proof is based on Git-tracked capsule files, not on
the ignored local source images.

## Validation Result

```yaml
result: passed
single_capsule_validation:
  accepted_french_summer_rattan_bucket_bag_001: passed
  accepted_product_still_life_tennis_wallet_001: passed
registry_validation:
  passed: true
  report_version: v2
  total_samples: 2
  passed_count: 2
  failed_count: 0
negative_case_validation:
  passed: true
  check_count: 20
agent_board_validation: passed
mvp_validation: passed
```

Commands run inside the clean checkout:

```powershell
npm ci
npm run validate-preview-capsule -- --sample-id=accepted_french_summer_rattan_bucket_bag_001
npm run validate-preview-capsule -- --sample-id=accepted_product_still_life_tennis_wallet_001
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Non-Authorization

This dry-run does not authorize or perform:

- provider/plugin/API calls
- image generation
- preview creation, copy, or conversion
- DailyNote or VCP memory write
- runtime, real manifest, VCPChat, or VCPToolBox access
- production candidate creation
- tag, release, deploy, or push

## Conclusion

The two accepted preview capsules are clone-portable at the current baseline.
The project can now treat `asset_archive/accepted_samples/` as a real
Git-portable evidence surface for these two accepted samples.
