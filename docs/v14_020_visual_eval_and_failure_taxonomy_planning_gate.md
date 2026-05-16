# V14.020 Visual Eval and Failure Taxonomy Planning Gate

```yaml
base_contract: AGENTS.md
phase: v14_020_visual_eval_and_failure_taxonomy_planning_gate
mode: A4.8 docs-only product planning gate
source_phase: v14_019_product_route_planning_selection_gate
source_commit: e5705dbb678acb60339ef1ad3f3476223c338711
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
intent: planning
risk_level: R1
```

## Current Context

The Review Console static prototype is archived as a static reference. V14.019 selected `B_visual_eval_and_failure_taxonomy_planning` as the next product route so Agent Image Lab can move from static UI shape back toward image production judgment infrastructure.

This gate defines the first planning layer for visual evaluation, accepted/rejected policy, failure categories, and minimal eval seed targets. It does not create schemas, sample files, registries, accepted samples, memory entries, image outputs, or runtime paths.

## Product Purpose

Agent Image Lab needs a stable definition of what a "good image" and a "failed image" mean before it can safely scale prompt workflows, review packages, delivery readiness, memory suitability, or production candidate planning.

The purpose of this planning layer is to make review decisions repeatable:

```yaml
product_purpose:
  define_good_image: true
  define_failed_image: true
  support_human_review: true
  support_future_schema_planning: true
  support_future_eval_seed_collection: true
  runtime_execution: false
  image_generation: false
```

## Visual Review Rubric Draft

Each generated or reviewed image should eventually be assessed against these dimensions.

```yaml
visual_review_rubric:
  composition:
    question: Is the product or subject clearly framed, dominant, and balanced?
    watch_items:
      - crowded frame
      - weak focal point
      - awkward crop
      - product buried by background
  lighting:
    question: Does lighting support product form, material, and commercial readability?
    watch_items:
      - flat lighting
      - blown highlights
      - muddy shadows
      - inconsistent light direction
  material_realism:
    question: Does the material look physically plausible and consistent with the product brief?
    watch_items:
      - ceramic becomes plastic
      - fabric becomes metallic
      - glass becomes cheap plastic
      - impossible reflections
  subject_accuracy:
    question: Does the output preserve product identity, geometry, and required structure?
    watch_items:
      - shape drift
      - missing handle or brim
      - wrong cap or dispenser
      - extra product variants
  commercial_usability:
    question: Could this image plausibly support ecommerce, campaign, or review handoff use?
    watch_items:
      - unusable crop
      - distracting props
      - poor product dominance
      - unclear deliverable intent
  ai_artifact_risk:
    question: Are there visible hallucinations, broken edges, fake text, or low-trust AI marks?
    watch_items:
      - malformed text
      - logo hallucination
      - distorted edges
      - inconsistent shadows
  brand_style_fit:
    question: Does the image match the intended style, category, and premium direction?
    watch_items:
      - over-stylized scene
      - generic stock look
      - wrong category mood
      - brand-incompatible color direction
```

## Failure Taxonomy Draft

```yaml
failure_taxonomy:
  material_failed:
    meaning: Product material no longer matches the brief or looks physically implausible.
    examples:
      - matte ceramic appears plastic
      - mesh fabric appears metallic
      - frosted glass appears as opaque plastic
  composition_failed:
    meaning: Frame, crop, product dominance, or visual balance fails the commercial intent.
    examples:
      - subject too small
      - key product edge cropped
      - background overwhelms product
  lighting_failed:
    meaning: Lighting reduces readability, realism, or premium product presentation.
    examples:
      - blown highlights
      - muddy dark scene
      - contradictory shadows
  subject_drift:
    meaning: The output changes required product identity, structure, or geometry.
    examples:
      - sports visor becomes closed cap
      - dropper bottle becomes pump bottle
      - mug handle structure changes
  text_or_logo_artifact:
    meaning: Unapproved text, fake brand marks, malformed letters, or label hallucination appear.
    examples:
      - random label text
      - fake logo
      - broken typography
  commercial_unusable:
    meaning: The image cannot support review, ecommerce, delivery readiness, or campaign use.
    examples:
      - product not identifiable
      - severe artifacts
      - misleading product category
  over_stylized:
    meaning: Styling overwhelms product truth or creates a non-commercial art direction.
    examples:
      - excessive cinematic effects
      - fantasy lighting
      - decorative clutter
  low_trust_ai_look:
    meaning: The image has subtle AI tells that reduce confidence even if no single defect dominates.
    examples:
      - waxy surfaces
      - inconsistent microtexture
      - uncanny shadows
```

## Accepted / Rejected Policy Draft

```yaml
review_outcomes:
  accepted_candidate:
    meaning: Strong enough to preserve as a candidate for delivery readiness or future evidence.
    requirements:
      - product identity preserved
      - no major artifact
      - commercial usability plausible
      - human review can defend the result
  patch_candidate:
    meaning: Direction is promising but needs bounded retouch, prompt refinement, or review notes.
    requirements:
      - core product identity remains intact
      - issues are specific and fixable
      - no severe category drift
  rejected_candidate:
    meaning: Output should not continue toward delivery readiness or memory suitability.
    requirements:
      - severe artifact or identity failure
      - commercial use not plausible
      - repair would require substantial regeneration or new route
  archive_reference_only:
    meaning: Useful as a learning/reference artifact but not a delivery or candidate asset.
    requirements:
      - contains review value
      - not suitable for accepted candidate lane
      - safe to reference as a non-production lesson
```

## Minimal Eval Seed Planning

No sample ingestion happens in this phase. The following targets define the future seed set only.

```yaml
minimal_eval_seed_targets:
  accepted_examples_target: 10
  rejected_examples_target: 10
  recurring_failure_types_target: 5
  sample_ingestion_performed: false
  eval_sample_files_created: false
  accepted_samples_written: false
  rejected_registry_created: false
```

Future eval seed collection should remain local, mock-safe when possible, and explicitly authorized before any real generated image or run output is read, copied, indexed, or committed.

## Relationship to Core Schema Planning

This gate is intentionally upstream of `A_visual_production_core_schema_planning`.

```yaml
future_schema_relationship:
  ShotPlan: should eventually reference intended rubric focus and known risk areas
  ImageCandidate: should eventually include review outcome and failure taxonomy fields
  ReviewRubric: should formalize the rubric dimensions from this gate
  RunReport: should summarize candidate distribution and failure types
  VisualMemory: should only receive approved, desensitized learning summaries in a later authorized memory planning path
schema_files_created_now: false
schema_modification_performed_now: false
```

## Explicit Blocked Boundaries

```yaml
prototype_files_modified: false
browser_preview_started: false
dev_server_started: false
live_server_started: false
localhost_runtime_started: false
browser_automation_used: false
cdp_or_runtime_evaluate_used: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
accepted_samples_written: false
runs_image_binary_read: false
runs_output_committed: false
eval_samples_created: false
accepted_registry_created: false
rejected_registry_created: false
production_candidate_002: false
memory_write_path: false
Batch_005: false
dependency_change: false
package_json_modified: false
package_lock_modified: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v14_021_visual_eval_rubric_fields_planning_gate
  auto_execution_allowed: true
  purpose: Refine the rubric dimensions into draft field names, scoring bands, review notes, and failure tags while remaining docs-only and non-runtime.
```
