# Review Console Rendered Console Fixture v14

```yaml
fixture_id: review_console_rendered_console_fixture_v14
source_phase: v14_007_review_console_docs_rendered_prototype_gate
source_commit: 80f334ee3ce41781d005164100d3fd175f2d1c34
fixture_type: synthetic_read_only_markdown_records
runtime_data: false
image_binary_ingestion: false
```

## Fixture Boundary

This fixture is a text-only sample for a markdown-rendered Review Console
prototype. It is not runtime data and must not be treated as an executable data
source.

```yaml
fixture_boundary:
  copies_images: false
  reads_image_binary: false
  writes_accepted_samples: false
  writes_memory: false
  provider_contact: false
  image_generation: false
  runtime_execution: false
```

## Record 1 — premium_portable_led_camping_lantern_v13_013

```yaml
ReviewAsset:
  asset_id: premium_portable_led_camping_lantern_v13_013
  product: premium_portable_led_camping_lantern
  source_output: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/native_doubao_1778838659034_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  asset_status: accepted_candidate_with_minor_watch_items
  accepted_candidate: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  accepted_samples_ready: false
  route_status: closed_as_accepted_candidate_with_delivery_readiness_package
  evidence_package_ref: docs/camping_lantern_accepted_candidate_evidence_package_v1.md
  delivery_readiness_package_ref: docs/camping_lantern_delivery_readiness_package_v1.md
  route_closeout_ref: docs/camping_lantern_route_closeout_v1.md
```

```yaml
EvidencePackage:
  evidence_package_id: camping_lantern_accepted_candidate_evidence_package_v1
  source_output: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/native_doubao_1778838659034_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  local_persistence_success: true
  provider_calls_used: 1
  generation_attempts_used: 1
  accepted_candidate: true
  key_findings:
    - product identity reads as premium portable LED camping lantern
    - controlled warm glow and plausible diffuser structure
    - accepted candidate retained with minor watch items
  watch_items:
    - diffuser_center_brightness
    - lower_body_darkness
    - base_body_separation
    - edge_readability_in_crop
    - product_identity_lock
```

```yaml
DeliveryReadiness:
  delivery_readiness_package_id: camping_lantern_delivery_readiness_package_v1
  commercial_delivery_ready: false
  retouch_needed_later: optional_minor_retouch
  QA_blockers:
    - delivery_readiness_review_required_before_commercial_delivery
    - accepted_samples_entry_policy_not_yet_authorized
    - memory_suitability_not_yet_authorized
  export_naming_policy: draft
  accepted_samples_ready: false
  memory_suitability: deferred
```

## Record 2 — premium_serum_bottle_v10_011

```yaml
ReviewAsset:
  asset_id: premium_serum_bottle_v10_011
  product: cosmetic_skincare_bottle / premium_serum_bottle
  source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  asset_status: accepted_candidate_with_minor_watch_items
  accepted_candidate: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  accepted_samples_ready: false
  route_status: reconstructed_as_visual_production_loop_sample
  evidence_package_ref: docs/premium_serum_bottle_accepted_candidate_evidence_package_v1.md
  delivery_readiness_package_ref: null
  route_closeout_ref: docs/visual_production_loop_reconstruction_premium_serum_bottle_v1.md
```

```yaml
EvidencePackage:
  evidence_package_id: premium_serum_bottle_accepted_candidate_evidence_package_v1
  source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  local_persistence_success: true
  provider_calls_used: 1
  generation_attempts_used: 1
  accepted_candidate: true
  key_findings:
    - premium skincare bottle identity retained
    - material and silhouette suitable for reconstruction sample
    - delivery and memory decisions remain deferred
  watch_items:
    - label_legibility_boundary
    - material_highlight_control
    - commercial_delivery_review_not_completed
```

```yaml
DeliveryReadiness:
  delivery_readiness_package_id: not_created
  commercial_delivery_ready: false
  retouch_needed_later: optional_minor_retouch
  QA_blockers:
    - delivery_readiness_package_not_created
    - accepted_samples_entry_policy_not_yet_authorized
    - memory_suitability_not_yet_authorized
  export_naming_policy: not_defined
  accepted_samples_ready: false
  memory_suitability: deferred
```

## Shared Safety Boundary

```yaml
SafetyBoundary:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  memory_write: false
  accepted_samples_written: false
  runs_output_committed: false
  real_retouch_execution: false
  production_candidate_002: false
```

These flags describe this fixture and prototype phase. Historical generation
records remain historical references only and do not authorize repeat execution.
