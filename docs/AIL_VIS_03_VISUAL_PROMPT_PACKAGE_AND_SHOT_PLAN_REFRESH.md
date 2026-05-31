# AIL-VIS-03 Visual Prompt Package And Shot Plan Refresh

Base contract: `AGENTS.md`

Phase: `AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh`
Mode: `docs_only_prompt_and_shot_planning`
Risk: `low_to_medium`

## Purpose

This phase refreshes the next visual production shot plan and prompt package
using the updated visual evaluation rubric and failure taxonomy from
`AIL-VIS-02`.

The goal is to prepare generation-ready planning artifacts on paper without
calling any provider, runtime, plugin, API, Review Console runtime, or image
generation path.

## Source Context From AIL-VIS-02

`AIL-VIS-02_visual_eval_rubric_and_failure_taxonomy_refresh` refreshed the
review language for:

- pass
- patch
- reject
- archive
- future memory suitability

Those review rules now drive the next planning artifacts.

## Selected Visual Production Target

The selected target remains the premium portable LED camping lantern line.

Target route:

- `premium_portable_led_camping_lantern`

Target visual direction:

- premium outdoor lifestyle hero product
- square 1:1 composition
- product-first framing
- blue-hour atmosphere with warm lantern glow
- dark metal shell, frosted diffuser, thin base, and integrated lower control

## Shot List

```yaml
shot_list:
  - shot_id: visual_production_next_shot_hero_01
    shot_role: hero_product_shot
    visual_goal: premium square hero image with the lantern as the dominant product
    subject: premium portable LED camping lantern
    composition_notes:
      - keep the full product visible
      - make the lantern larger and more dominant than the previous hero plan
      - keep the top and side negative space controlled
      - keep the table shallow and horizontal
    lighting_notes:
      - use deep blue-hour ambient light
      - preserve warm diffuser glow
      - keep metal highlights readable
    material_realism_requirements:
      - frosted diffuser micro-texture
      - dark premium metal shell
      - thin compact base
      - smaller integrated lower-body control
    commercial_usability_requirements:
      - product must read clearly on first glance
      - keep clean negative space for later headline placement
      - avoid text, logos, and clutter
    failure_risks:
      - subject drift
      - plastic look
      - composition too loose
      - oversized knob
      - flat lighting
      - visible AI artifact risk
    review_rubric_refs:
      - docs/VISUAL_EVAL_RUBRIC.md
      - docs/VISUAL_FAILURE_TAXONOMY.md
    generation_allowed_now: false

  - shot_id: visual_production_next_shot_material_detail_01
    shot_role: material_detail_shot
    visual_goal: closer supporting shot that validates diffuser, metal, and control integration
    subject: premium portable LED camping lantern
    composition_notes:
      - tighter crop than the hero shot
      - keep the key product surfaces and control readable
      - avoid turning the detail shot into a macro texture abstraction
    lighting_notes:
      - keep warm-cool separation visible
      - preserve believable diffuser scattering
    material_realism_requirements:
      - diffuser thickness should feel physical
      - metal seams should read as manufactured
      - base should stay refined and thin
    commercial_usability_requirements:
      - useful as evidence, not a replacement for the hero shot
      - keep the product obviously the same route asset
    failure_risks:
      - detail distortion
      - material_fake_or_plastic
      - lighting_inconsistent
      - ai_artifact_visible
    review_rubric_refs:
      - docs/VISUAL_EVAL_RUBRIC.md
      - docs/VISUAL_FAILURE_TAXONOMY.md
    generation_allowed_now: false
```

## Shot-Level Review Criteria

### Hero shot

The hero shot should pass only if:

- the lantern is immediately readable as the intended product
- the composition feels campaign-grade and product-first
- the lighting keeps both the glow and the metal structure believable
- the diffuser, shell, lower control, and base all remain plausible
- the image avoids visible AI artifacts, text, logos, and clutter

### Material detail shot

The detail shot should pass only if:

- the product identity stays stable
- the close-up supports material realism rather than distorting it
- the diffuser, seams, and control integration remain believable
- the shot helps diagnose quality without introducing new failure modes

## Prompt Package Structure

The next prompt package should be a generation-ready planning artifact with:

- one clear target shot
- a synchronized positive prompt draft
- a synchronized negative prompt draft
- explicit visual constraints
- explicit forbidden elements
- failure taxonomy mapping
- review required flags
- a blocked generation boundary

## Positive Prompt Constraints

The positive prompt should emphasize:

- premium portable LED camping lantern
- square 1:1 hero composition
- product-first commercial readability
- dark metal shell with refined industrial detailing
- frosted diffuser with believable internal scattering
- smaller integrated lower-body control
- thin refined base
- deep blue-hour atmosphere with warm amber glow
- clean negative space and campaign usability

## Negative Prompt Constraints

The negative prompt should block:

- subject drift to flashlight, speaker, bottle, desk lamp, humidifier, thermos, candle, or vintage lantern
- oversized or detached-looking control hardware
- thick chunky base
- flat plastic diffuser
- cheap gray shell
- text, logo, watermark, fake label, or random letters
- people, hands, extra products, clutter, or fire touching the product
- cluttered or overpowering background
- visible AI artifact problems such as warped geometry or broken handle logic

## Failure Taxonomy Mapping

This phase should map the planning artifacts to the rubric and taxonomy with
the following primary concerns:

- `subject_drift`
- `material_fake_or_plastic`
- `lighting_inconsistent`
- `composition_unusable`
- `commercial_unfit`
- `background_noise`
- `detail_distortion`
- `text_logo_or_brand_risk`
- `human_or_hand_anomaly`
- `ai_artifact_visible`
- `provenance_or_trace_missing`
- `memory_unsuitable`

## No-Generation Boundary

This phase does not allow:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005

## Next Possible Generation Gate

The next gate after this planning step should be a separate generation
authorization gate.

Suggested next phase:

- `AIL-VIS-04_visual_generation_authorization_gate`

## Forbidden Actions

This phase forbids:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Closeout YAML Template

```yaml
AIL_VIS_03_closeout:
  phase: AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh
  mode: docs_only_prompt_and_shot_planning
  status: completed_validated
  source_phase: AIL-VIS-02_visual_eval_rubric_and_failure_taxonomy_refresh
  selected_product: premium_portable_led_camping_lantern
  generation_allowed_now: false
  provider_call_allowed_now: false
  image_generation_allowed_now: false
  selected_next_phase: AIL-VIS-04_visual_generation_authorization_gate
```
