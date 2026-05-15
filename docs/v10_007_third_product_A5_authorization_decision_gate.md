# v10.007 Third Product A5 Authorization Decision Gate

```yaml
gate_template:
  phase: v10_007_third_product_A5_authorization_decision_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R3
  source_phase: v10_006_third_product_prompt_package_static_review_and_yaml_format_fix_gate
  source_commit: 0ba94323c6f07412503c96cd6de48a0650094193
  selected_route: third_product_prompt_workflow_expansion
  selected_product: cosmetic_skincare_bottle / premium_serum_bottle
  locked_structure: frosted_translucent_glass_bottle_with_clean_dropper_cap
  product_brief_ref: briefs/product_brief_premium_serum_bottle_v1.md
  prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  static_review_result: pass_for_static_review
  A5_authorization_created: false
  provider_contact_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
```

## Purpose

This gate records the human decision point for whether the third product, a
premium serum bottle / cosmetic skincare bottle, should move from A4.8 static
prompt readiness into a future A5 minimal real generation trial.

This document does not create that A5 authorization. It only presents the
options and stops before provider execution.

## Current Readiness State

```yaml
third_product_readiness:
  selected_product: cosmetic_skincare_bottle / premium_serum_bottle
  structure_lock: frosted_translucent_glass_bottle_with_clean_dropper_cap
  product_brief_created: true
  product_brief_ref: briefs/product_brief_premium_serum_bottle_v1.md
  prompt_package_created: true
  prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  prompt_package_static_review_result: pass_for_static_review
  A5_authorization_created: false
  provider_contact: false
  image_generation: false
```

The static package is ready enough for a human authorization decision because it
has a clear product identity, a locked dropper-cap structure, frosted glass
material language, label/text boundaries, reflection controls, and negative
constraints against common category drift.

## Option A - Authorize One Minimal Real Generation Trial

Meaning: authorize one future A5 minimal real generation trial using
`prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml`.

Risk: high but bounded.

Required future authority:

- A5 execution authorization.
- Provider contact.
- `.env.local` necessary secret read limited to the generation runner's required Doubao fields.
- Image generation.
- Local output persistence verification.

Required future limits:

- `provider_calls_max: 1`
- `generation_attempts_max: 1`
- `output_images_max: 1`
- `auto_retry: false`
- `stop_after_generation: true`
- `human_review_required_after_generation: true`

Success condition: the future run must verify a real local output file count
before any human review state can be marked as ready.

This is the recommended route if the project goal is to validate third-product
cross-category generation capability. It is not self-executing and cannot begin
until the human provides a separate explicit A5 authorization.

## Option B - More Static Prompt / Payload Review Before Generation

Meaning: continue A4.8 static review before any provider execution.

Risk: low.

Best fit: choose this if the reviewer still wants more confidence in label text
avoidance, frosted glass material control, dropper cap geometry, reflection
control, runner parsing, or local output persistence semantics.

Allowed future work under this route remains docs-only / static validation only.

## Option C - Stop Third Product Real Generation Route Here

Meaning: keep the third product brief and prompt package as A4.8 artifacts, but
do not enter real generation.

Risk: lowest.

Tradeoff: V10 will not validate the serum bottle prompt package against a real
provider output. The product route remains useful as a reusable prompt workflow
example, but it will not become a real-output candidate chain.

## Recommendation

```yaml
recommended_option: authorize_one_minimal_real_generation_trial
recommendation_scope: human_decision_only
reason: V10 Option C was selected to test third-product prompt workflow expansion, and the static package now passes enough checks to justify one tightly bounded real trial if the human wants real cross-category evidence.
codex_auto_execution_allowed: false
```

Codex must stop here. A future minimal generation trial requires a separate A5
authorization package that names the prompt package, output directory, provider
call budget, generation attempt budget, `.env.local` access boundary, validation
requirements, and stop conditions.

## Explicit Non-Authorization

```yaml
explicit_non_authorization:
  A5_authorization_created: false
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  runtime: false
  CDP_bridge_MCP: false
  accepted_samples_write: false
  runs_output_commit: false
  real_output_directory_created: false
```

## Closeout State

```yaml
decision_gate:
  selected_product: cosmetic_skincare_bottle / premium_serum_bottle
  prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  static_review_result: pass_for_static_review
  A5_authorization_created: false
  options_presented:
    - authorize_one_minimal_real_generation_trial
    - more_static_prompt_payload_review
    - stop_third_product_real_generation_route
  recommended_option: authorize_one_minimal_real_generation_trial
  human_decision_required: true

recommended_next:
  phase: pending_human_third_product_generation_authorization
  auto_execution_allowed: false
  purpose: 等待人工选择 Option A/B/C；不得自动进入 provider execution。
```
