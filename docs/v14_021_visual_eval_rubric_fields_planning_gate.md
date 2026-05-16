# V14.021 Visual Eval Rubric Fields Planning Gate

```yaml
base_contract: AGENTS.md
phase: v14_021_visual_eval_rubric_fields_planning_gate
mode: A4.8 docs-only product planning gate
source_phase: v14_020_visual_eval_and_failure_taxonomy_planning_gate
source_commit: 48d634c9cedb8b4ea221bb1e6788867d830475cc
selected_product_route: B_visual_eval_and_failure_taxonomy_planning
intent: planning
risk_level: R1
```

## Purpose

V14.020 defined the high-level visual evaluation and failure taxonomy layer. V14.021 turns that layer into concrete rubric field planning so a future review record, schema, fixture, or Review Console surface can use stable field names and decision thresholds.

This gate remains planning-only. It does not create schema files, eval samples, accepted/rejected registries, accepted_samples entries, image outputs, memory entries, runtime paths, provider calls, or production candidates.

## Rubric Dimensions

```yaml
rubric_dimensions:
  - composition
  - lighting
  - material_realism
  - subject_accuracy
  - commercial_usability
  - ai_artifact_risk
  - brand_style_fit
```

## Per-Dimension Field Shape

Every rubric dimension should eventually share the same review-note structure.

```yaml
per_dimension_fields:
  score:
    type: integer
    scale: 0_to_10
    meaning: Human reviewer score for the dimension.
  observation:
    type: string
    meaning: Short visible evidence summary written by the reviewer.
  pass_condition:
    type: string
    meaning: What must be true for the dimension to support acceptance.
  patch_condition:
    type: string
    meaning: What limited issue can still be addressed by retouch, prompt refinement, or review notes.
  reject_condition:
    type: string
    meaning: What failure makes the candidate unsuitable for continued delivery or candidate routing.
  evidence_note:
    type: string
    meaning: Concrete visual cue supporting the score and decision.
```

## Dimension Field Planning

```yaml
dimension_field_plan:
  composition:
    score: composition_score
    observation: composition_observation
    pass_condition: subject is dominant, crop is usable, and visual balance supports the product.
    patch_condition: minor crop, spacing, or background dominance issue remains fixable.
    reject_condition: subject is buried, cut off, or visually incoherent.
    evidence_note: composition_evidence_note
  lighting:
    score: lighting_score
    observation: lighting_observation
    pass_condition: light direction, shadow depth, and highlight control support material readability.
    patch_condition: minor shadow cleanup or highlight softening is enough.
    reject_condition: blown highlights, muddy shadows, or contradictory light direction break realism.
    evidence_note: lighting_evidence_note
  material_realism:
    score: material_realism_score
    observation: material_realism_observation
    pass_condition: material matches the product brief and looks physically plausible.
    patch_condition: small texture or finish issue is still correctable.
    reject_condition: material identity drifts into the wrong surface class.
    evidence_note: material_realism_evidence_note
  subject_accuracy:
    score: subject_accuracy_score
    observation: subject_accuracy_observation
    pass_condition: product identity, geometry, and required structure are preserved.
    patch_condition: minor edge, seam, handle, brim, cap, or label cleanup is enough.
    reject_condition: product structure, category, or required identity changes.
    evidence_note: subject_accuracy_evidence_note
  commercial_usability:
    score: commercial_usability_score
    observation: commercial_usability_observation
    pass_condition: image can plausibly support ecommerce, campaign, or delivery-readiness review.
    patch_condition: usable core image with minor polish or handoff issues.
    reject_condition: image is misleading, unusable, or not credible as a commercial asset.
    evidence_note: commercial_usability_evidence_note
  ai_artifact_risk:
    score: ai_artifact_risk_score
    observation: ai_artifact_risk_observation
    pass_condition: no visible hallucination, broken text, malformed edge, or low-trust AI tell.
    patch_condition: small isolated artifact can be retouched without changing product identity.
    reject_condition: artifacts are prominent, repeated, or affect product truth.
    evidence_note: ai_artifact_risk_evidence_note
  brand_style_fit:
    score: brand_style_fit_score
    observation: brand_style_fit_observation
    pass_condition: style, category mood, and premium direction match the intended route.
    patch_condition: minor color, contrast, or background tone issue remains fixable.
    reject_condition: image becomes over-stylized, generic, off-category, or brand-incompatible.
    evidence_note: brand_style_fit_evidence_note
```

## Scoring Policy

```yaml
scoring_policy:
  scale: 0_to_10
  score_meaning:
    0_2: severe failure
    3_4: major weakness
    5_6: usable direction with notable issues
    7_8: strong candidate with minor watch items
    9_10: excellent candidate quality
  minimum_acceptance_threshold:
    per_dimension_minimum: 7
    average_score_minimum: 7.5
    required_hard_reject_count: 0
  patch_candidate_threshold:
    per_dimension_floor: 5
    average_score_minimum: 6
    issue_scope: bounded and fixable
  reject_threshold:
    any_dimension_at_or_below: 2
    average_below: 5
    hard_reject_condition_present: true
  human_override_required: true
```

Scores are planning aids, not automatic approvals. Human review remains the final authority, and any future automated scoring must be treated as recommendation-only.

## Hard Reject Conditions

```yaml
hard_reject_conditions:
  subject_identity_broken: true
  product_category_drift: true
  unauthorized_logo_or_readable_fake_text: true
  severe_material_drift: true
  major_geometry_error: true
  commercial_misrepresentation: true
  obvious_low_trust_ai_artifacts: true
  unsafe_or_forbidden_content: true
```

If any hard reject condition is present, the global decision should not be `accepted_candidate` even if several individual scores are high.

## Global Decision Planning

```yaml
global_decision:
  accepted_candidate:
    requirements:
      - all hard reject conditions are false
      - per-dimension minimum is met
      - average score meets or exceeds acceptance threshold
      - human reviewer approves candidate status
  patch_candidate:
    requirements:
      - no severe identity failure
      - issues are bounded and fixable
      - human reviewer records exact patch notes
  rejected_candidate:
    requirements:
      - hard reject condition present
      - severe category, material, geometry, or artifact failure
      - commercial use is not plausible
  archive_reference_only:
    requirements:
      - candidate is not suitable for active route
      - image still has learning value
      - reviewer marks it as non-production reference
```

## Review Note Structure

```yaml
review_note_structure:
  reviewer:
    required_later: true
  reviewed_asset_ref:
    required_later: true
  rubric_scores:
    required_later: true
  visible_evidence_summary:
    required_later: true
  failure_taxonomy_tags:
    required_later: true
  recommended_global_decision:
    required_later: true
  human_override:
    required_later: true
  next_action_note:
    required_later: true
```

This gate plans the field shape only. It does not create a review record schema or any sample review files.

## Failure Taxonomy Linkage

```yaml
failure_taxonomy_linkage:
  composition:
    maps_to:
      - composition_failed
      - commercial_unusable
  lighting:
    maps_to:
      - lighting_failed
      - low_trust_ai_look
  material_realism:
    maps_to:
      - material_failed
      - low_trust_ai_look
  subject_accuracy:
    maps_to:
      - subject_drift
      - commercial_unusable
  commercial_usability:
    maps_to:
      - commercial_unusable
      - over_stylized
  ai_artifact_risk:
    maps_to:
      - text_or_logo_artifact
      - low_trust_ai_look
  brand_style_fit:
    maps_to:
      - over_stylized
      - commercial_unusable
```

## Future Schema Route

```yaml
future_schema_route:
  next_schema_track_candidate: A_visual_production_core_schema_planning
  likely_future_schema_surfaces:
    - ReviewRubric
    - ImageCandidate
    - RunReport
    - VisualMemory
  schema_files_created_now: false
  schema_modification_performed_now: false
```

The future schema route should only begin after a separate planning gate confirms exact schema file targets and validation requirements.

## Blocked Boundaries

```yaml
prototype_files_modified: false
schema_files_created: false
eval_samples_created: false
accepted_registry_created: false
rejected_registry_created: false
accepted_samples_written: false
browser_preview_started: false
dev_server_started: false
live_server_started: false
localhost_runtime_started: false
browser_automation_used: false
cdp_or_runtime_evaluate_used: false
runtime_execution: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write: false
runs_image_binary_read: false
runs_output_committed: false
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
  phase: v14_022_visual_eval_decision_policy_planning_gate
  auto_execution_allowed: true
  purpose: Define docs-only global decision policy, hard reject handling, human override behavior, and review-note minimums without creating schemas, samples, runtime, provider, image, memory, or production paths.
```
