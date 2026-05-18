# v7.280 Prompt v4 Handle Geometry Refinement Authorization Gate

## Phase Summary

```yaml
phase: v7.280_prompt_v4_handle_geometry_refinement_authorization_gate
mode: A4_prompt_refinement_plus_A5_bounded_authorization_gate
source_phase: v7.279_best_candidate_selection_or_fourth_trial_decision_gate
human_authorization_received: true
commit_message: "docs: authorize fourth minimal generation trial"
```

This gate creates the v4 prompt package and records the human authorization for
exactly one fourth minimal real generation trial. It does not perform generation
by itself. The only execution phase enabled by this gate is
`v7.281_fourth_minimal_generation_trial_execution`.

## v4 Refinement Intent

v4 is a narrow handle-geometry refinement. It is not a new product exploration,
not a new style direction, and not a batch. It preserves the v2 composition and
uses v3 only as negative feedback.

Required v4 behavior:

- Preserve v2 composition and product scale.
- Do not change the product style or camera angle drastically.
- Use realistic smooth ceramic handle geometry.
- Keep clean upper and lower handle attachment points.
- Forbid blocky notch, cutout, dent, malformed joint, broken handle, fused handle, or impossible handle connection.
- Keep matte cream-white ceramic texture.
- Keep a clean cup rim.
- Keep a warm-gray premium background, brighter and less muddy than v3.
- Keep soft premium shadow, not too dark.
- Forbid colored specks, random pixels, and corner artifacts.
- Keep no logo, no text, no people, and no props.

## Prompt Package

```yaml
prompt_v4_created: true
approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
source_best_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
source_negative_feedback_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
source_best_candidate: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
source_negative_feedback_output: runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg
```

## Authorization Boundary

```yaml
authorization:
  approved_product: matte_ceramic_mug
  approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 4
  output_directory: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/
  auto_retry: false
  stop_after_generation: true
  human_review_required_after_generation: true
  memory_write: false
  DailyNote_write: false
  VCP_memory_write: false
  production_candidate_002: false
  Batch_005: false
  fifth_generation_auto_start: false
```

## Execution Scope For v7.281

```yaml
v7_281_allowed_execution:
  product: matte_ceramic_mug
  prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
  output_directory: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 4
  auto_retry: false
  stop_after_generation: true
```

## Explicit Non-Expansion

This authorization does not allow:

- retry
- fifth generation
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

This authorization gate must be committed and pushed before v7.281 starts.
Staging must use exact file paths only. `git add .` remains forbidden.

## Closeout Template

```yaml
closeout:
  phase: v7.280_prompt_v4_handle_geometry_refinement_authorization_gate
  commit_hash:
  commit_message: "docs: authorize fourth minimal generation trial"
  branch: master
  push_performed:
  local_equals_origin:
  ahead_behind:
  git_status:

  authorization:
    fourth_minimal_generation_trial_authorized: true
    approved_product: matte_ceramic_mug
    approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
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
    fifth_generation_auto_start: false

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
    phase: v7.281_fourth_minimal_generation_trial_execution
    auto_execution_allowed: true
    purpose: "Use prompt v4 for exactly one bounded fourth trial, then stop for human review."

  final_state:
    next_phase_started: false
```
