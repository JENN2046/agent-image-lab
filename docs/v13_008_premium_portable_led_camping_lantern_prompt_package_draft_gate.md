# v13.008 Premium Portable LED Camping Lantern Prompt Package Draft Gate

```yaml
phase: v13_008_premium_portable_led_camping_lantern_prompt_package_draft_gate
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
source_phase: v13_007_next_product_visual_production_trial_planning_gate
source_commit: eaab60f16d3fef7467b5d2afc2b78e6e0ea3c150
commit_message: "docs: draft prompt package for camping lantern"
```

## Purpose

This gate creates the canonical prompt package draft for the fourth product,
`premium_portable_led_camping_lantern`, using the V13 Visual Production Loop
planning record.

This prompt package is only a draft artifact for static review and a later
independent A5 decision. It is not A5 authorization and does not permit provider
contact, image generation, `.env.local` reads, output directory creation, memory
write, production execution, real retouch, real delivery, or accepted sample
writing.

## Created Artifact

```yaml
prompt_package_path: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
selected_product: premium_portable_led_camping_lantern
product_identity: premium portable LED camping lantern
locked_structure: compact_single_lantern_with_translucent_diffuser_attached_handle_loop_and_stable_base
shot_ref: docs/next_product_visual_production_trial_plan_v13_007.md#hero_product_shot
```

## Field Coverage

```yaml
package_id: present
selected_product: present
product_identity: present
locked_structure: present
product_brief_ref: present
shot_ref: present
prompt_literal_block: present
positive_prompt_literal_block: present
negative_prompt_literal_block: present
runner_prompt_mapping: present
visual_intent: present
material_constraints: present
structure_constraints: present
scene_constraints: present
lighting_camera: present
forbidden_elements: present
acceptance_criteria: present
human_review_checklist: present
A5_authorization_required_later: true
provider_contact_allowed: false
image_generation_allowed: false
memory_write_allowed: false
production_candidate_002_allowed: false
```

## Boundary

```yaml
prompt_package_created: true
A5_authorization_created: false
A5_execution_started: false
provider_contact: false
image_generation: false
output_directory_created: false
env_local_secret_value_read: false
memory_write: false
accepted_samples_written: false
runs_output_committed: false
```

## Closeout

```yaml
closeout:
  phase: v13_008_premium_portable_led_camping_lantern_prompt_package_draft_gate
  prompt_package:
    selected_product: premium_portable_led_camping_lantern
    prompt_package_path: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
    prompt_package_created: true
    canonical_prompt_field_present: true
    positive_prompt_present: true
    positive_prompt_synced: true
    negative_prompt_present: true
    A5_authorization_required_later: true
    A5_authorization_created: false
    provider_contact: false
    image_generation: false
    output_directory_created: false
    memory_write: false
  final_state:
    next_phase_started: false
```
