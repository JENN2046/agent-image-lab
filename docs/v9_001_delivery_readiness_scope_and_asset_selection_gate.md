# v9.001 Delivery Readiness Scope And Asset Selection Plus Code Surface Guard Gate

```yaml
phase: v9_001_delivery_readiness_scope_and_asset_selection_plus_code_surface_guard_gate
base_contract: AGENTS.md
mode: A4.8_static_review_small_code_surface_guard
source_phase: v9_delivery_readiness_layer_route_selection_gate
source_commit: a461ce90c3e6072928eca23caf8f625f58f05d8b
selected_route: delivery_readiness_layer
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
memory_write: false
production_candidate_002: false
```

## Purpose

This gate defines the first V9 delivery-readiness scope without entering a delivery package, provider execution, memory write, or production-candidate promotion. It also hardens the local Native Doubao preflight surface so prompt loading and local output persistence remain reproducible before any future execution gate.

## Asset Selection Matrix

| Candidate | Current status | Strength | Remaining delivery gap | Readiness risk | Decision |
|---|---|---|---|---|---|
| ceramic mug v4 | accepted_candidate_with_minor_retouch | Mature V7 evidence chain, final retouch plan, retouch acceptance criteria, and delivery package spec already exist. | Not commercial_delivery_ready; still needs delivery-readiness packaging and retouch handoff review. | Low. | Select first. |
| multi_color_mesh_sports_visor v8_033 | accepted_candidate_with_minor_watch_items | Proves multi-product reuse and has verified local persistence after the output guard fix. | Newer candidate; needs first delivery-readiness pattern to exist before repeating across products. | Medium. | Hold as second delivery-readiness candidate. |

Selected first asset for delivery readiness:

```text
ceramic_mug_v4
```

Selected candidate path:

```text
runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
```

Rationale:

- The ceramic mug v4 chain is older, better documented, and already has Route A final-retouch planning artifacts.
- The sports visor remains valuable as the second-asset validation target, but should reuse the delivery-readiness pattern after the ceramic mug package establishes it.
- Neither asset is commercial_delivery_ready yet.
- Neither asset is allowed to enter `accepted_samples/`, memory write, or `production_candidate_002` in this gate.

## Post-Push Status Wording Correction

The prior route-selection gate is no longer pending guarded push after the repository synced at `a461ce9`.

Correct wording:

```text
v9_delivery_readiness_layer_route_selection_gate: completed_remote_synced_after_guarded_push
local_equals_origin: true
ahead_behind: 0/0
```

## Git Ignore Guard

Required local checks:

```text
git check-ignore -v runs/ -> no direct output because tracked placeholder/history files exist under runs/
git check-ignore -v --no-index runs/ -> .gitignore:1:/runs/
git check-ignore -v .env.local -> .gitignore:8:.env.local
git check-ignore -v .agent_private/ -> .gitignore:3:/.agent_private/
git check-ignore -v runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg -> .gitignore:1:/runs/
```

Interpretation:

- `.gitignore` is not malformed.
- `runs/` generated outputs remain ignored.
- The root `runs/` directory contains tracked historical placeholder/docs files, so plain `git check-ignore -v runs/` does not report the tracked directory itself.
- No `.gitignore` patch is required in this gate.

## Native Doubao Code Surface Guard

Static guard results:

```text
loadPromptPackage(prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml).prompt_non_empty: true
loadPromptPackage(prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml).negative_prompt_non_empty: true
normalizeResult cannot create success from files_written_count alone: true
normalizeResult cannot create success from local_persistence_success flag alone: true
human_review_required_now requires verified local file count: true
```

Local reproducibility patch:

- `scripts/validate_native_doubao_sandbox.js` now includes explicit prompt v2 loader checks for non-empty `prompt` and `negative_prompt`.
- The validator also includes an explicit check that human review readiness requires `local_files_verified_count > 0`.
- No provider contact, image generation, retry, `.env.local` value read, or output directory creation is needed for these checks.

## Delivery Readiness Boundary

Allowed next phase:

```text
v9_002_delivery_readiness_package_gate
```

Purpose:

```text
为 ceramic_mug_v4 建立交付准备包；不生成图、不写 memory、不进 production。
```

Still forbidden:

```text
provider_contact: false
image_generation: false
retry: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
accepted_samples_write: false
production_candidate_002: false
Batch_005: false
```

## Closeout

```yaml
closeout:
  phase: v9_001_delivery_readiness_scope_and_asset_selection_plus_code_surface_guard_gate
  source_commit: a461ce90c3e6072928eca23caf8f625f58f05d8b
  delivery_readiness_layer_selected: true
  asset_selection_matrix_created: true
  selected_first_asset_for_delivery_readiness: ceramic_mug_v4
  commercial_delivery_ready: false
  memory_write_allowed: false
  production_candidate_002_allowed: false
  gitignore_checked: true
  prompt_v2_loader_checked: true
  prompt_v2_prompt_non_empty: true
  prompt_v2_negative_prompt_non_empty: true
  output_persistence_guard_checked: true
  local_file_required_for_human_review: true
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  DailyNote_write: false
  VCP_memory_write: false
  production_candidate_002: false
  Batch_005: false
  recommended_next: v9_002_delivery_readiness_package_gate
  next_phase_started: false
```
