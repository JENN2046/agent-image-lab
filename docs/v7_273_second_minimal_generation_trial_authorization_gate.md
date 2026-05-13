# v7.273 Second Minimal Generation Trial Authorization Gate

## Phase Summary

```yaml
phase: v7.273_second_minimal_generation_trial_authorization_gate
mode: A5_authorization_gate_docs_and_board_update
source_phase: v7.272_prompt_v2_static_review_and_second_trial_authorization_gate
source_status: static_review_passed
human_authorization_received: true
commit_message: "docs: authorize second minimal generation trial"
```

This gate records the human decision to authorize a second minimal real
generation trial. It does not perform generation by itself. The only execution
phase enabled by this gate is `v7.274_second_minimal_generation_trial_execution`.

## Authorization Boundary

```yaml
authorization:
  approved_product: matte_ceramic_mug
  approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 4
  auto_retry: false
  stop_after_generation: true
  human_review_required_after_generation: true
  memory_write: false
  DailyNote_write: false
  VCP_memory_write: false
  production_candidate_002: false
  Batch_005: false
```

## Purpose

The second trial exists only to test whether prompt package v2 improves the
first real output issues recorded in v7.270:

- product scale too small
- excessive top whitespace
- flat lighting
- weak background depth
- slightly rough rim
- slightly blurred handle joint
- tiny colored speck
- insufficient commercial main-image refinement

## Execution Scope For v7.274

```yaml
v7_274_allowed_execution:
  product: matte_ceramic_mug
  prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
  output_directory: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 4
  auto_retry: false
  stop_after_generation: true
```

## Explicit Non-Expansion

This authorization does not allow:

- retry
- third generation
- prompt package switch
- product switch
- Batch 005
- `production_candidate_002`
- `memory_write_path`
- DailyNote write
- VCP memory write
- generated output image staging
- `accepted_samples/`
- dependency changes
- `package.json` changes
- CDP / bridge / MCP
- tag / release / deploy

## Commit And Push Gate

The authorization gate may be committed and pushed before v7.274 starts.
Staging must use exact file paths only. `git add .` remains forbidden.

## Closeout Template

```yaml
closeout:
  phase: v7.273_second_minimal_generation_trial_authorization_gate
  commit_hash:
  commit_message: "docs: authorize second minimal generation trial"
  branch: master
  push_performed:
  local_equals_origin:
  ahead_behind:
  git_status:

  authorization:
    second_minimal_generation_trial_authorized: true
    approved_product: matte_ceramic_mug
    approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 4
    auto_retry: false
    stop_after_generation: true
    human_review_required_after_generation: true
    memory_write: false
    DailyNote_write: false
    VCP_memory_write: false
    production_candidate_002: false
    Batch_005: false

  safety:
    generation_in_authorization_gate: false
    provider_contact_in_authorization_gate: false
    image_generation_in_authorization_gate: false
    memory_write: false
    DailyNote_write: false
    VCP_memory_write: false
    dependency_change: false
    package_json_modified: false
    CDP_bridge_MCP: false

  recommended_next:
    phase: v7.274_second_minimal_generation_trial_execution
    auto_execution_allowed: true
    purpose: "Use prompt v2 for exactly one bounded second trial, then stop for human review."

  final_state:
    next_phase_started: false
```
