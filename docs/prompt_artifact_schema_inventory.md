# Prompt Artifact Schema Inventory

V11.003 inventories existing prompt workflow artifacts across the three completed product routes:

- `matte_ceramic_mug`
- `multi_color_mesh_sports_visor`
- `cosmetic_skincare_bottle / premium_serum_bottle`

This is an inventory only. It does not authorize provider contact, generation, retry, `.env.local` reading, memory write, accepted_samples write, production promotion, runtime work, or runner behavior changes.

## Inventory Table

| artifact_type | representative_files | required_fields_seen | missing_or_inconsistent_fields | schema_drift_examples | recommended_schema_action | machine_validation_currently_available |
|---|---|---|---|---|---|---|
| product_brief_artifacts | `briefs/product_brief_multi_color_mesh_sports_visor_v1.md`; `briefs/product_brief_premium_serum_bottle_v1.md`; ceramic mug route represented by prompt and route docs rather than a dedicated `briefs/` artifact | Product identity, visual direction, key materials, expected output intent, non-goals and review criteria are present in later product briefs. | Dedicated ceramic mug product brief is not present in the same `briefs/` form; field names are prose-driven rather than normalized. | Ceramic mug route predates the product brief template. Sports visor and serum bottle use a clearer brief-first route. | Define a compact product brief schema with `product_id`, `product_name`, `identity_lock`, `structure_lock`, `materials`, `color_strategy`, `scene_strategy`, `label_logo_text_policy`, `non_goals`, and `review_focus`. | Partial. Project validation checks status surfaces and indexes, but no field-level product brief schema validator is currently present. |
| prompt_package_artifacts | `prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml`; `prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml`; `prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml` | `prompt: |`, `negative_prompt: |`, product/scene/material controls, human review checklist, and no-execution flags are visible. Sports visor and serum bottle also include `positive_prompt: |` and `runner_prompt_mapping`. | Older mug packages do not retain `positive_prompt: |`; product identity, structure lock, material constraints, and label/fake-text boundaries are not normalized across all packages. | V8.018 fixed the canonical `prompt` mapping risk after a failed HTTP 400. Later packages include `prompt` plus `positive_prompt`; mug v4 uses `prompt` only. | Draft a canonical prompt package schema requiring runner-facing `prompt`, optional synchronized `positive_prompt`, independent `negative_prompt`, `runner_prompt_mapping`, `product_identity`, `structure_lock`, `material_constraints`, `scene_constraints`, `text_logo_policy`, `output_limits`, and `execution_flags`. | Partial. YAML and sandbox validation exist indirectly; no unified prompt package schema validator yet enforces all canonical fields. |
| static_review_artifacts | `docs/archive/phases/v8/v8_024_second_product_prompt_v2_static_review_gate.md`; `reviews/v8_024_second_product_prompt_v2_static_review.md`; `docs/archive/phases/v11/v11_002_prompt_schema_hardening_route_activation_gate.md` | Static review gates record whether prompt revisions address color coverage, product hierarchy, scene, material detail, and independent A5 authorization boundaries. | Static review field names vary; pass/fail semantics are prose-led and not consistently machine-addressable. | Sports visor v2 static review is detailed because v8.021 had specific watch items. Earlier routes use less formal static review records. | Define a static review schema with `review_target`, `source_findings`, `checks`, `pass_result`, `remaining_risks`, `A5_authorization_created: false`, and `next_gate`. | Partial. Current validation catches broad project-state errors, not individual static review checklist completeness. |
| A5_authorization_execution_confirmation_artifacts | `docs/archive/phases/v7/v7_280_prompt_v4_handle_geometry_refinement_authorization_gate.md`; `docs/archive/phases/v8/v8_032_second_product_post_persistence_fix_generation_authorization_gate.md`; `docs/archive/phases/v10/v10_009_third_product_minimal_generation_authorization_draft_gate.md`; `docs/archive/phases/v10/v10_010_third_product_minimal_generation_execution_confirmation_gate.md` | Approved product, prompt package, output directory, provider call budget, generation attempt budget, output image budget, no retry, stop-after-generation, and secret boundary appear in later gates. | Older records can combine prompt refinement context and authorization boundary more tightly; `success_requires_verified_local_file` is stable after the output persistence guard but not equally visible in older gates. | V10 splits draft authorization and execution confirmation. V8.032 reflects post-persistence-fix success criteria. | Define separate schemas for `authorization_draft`, `execution_confirmation`, and `execution_closeout`; require `provider_calls_max`, `generation_attempts_max`, `output_images_max`, `auto_retry`, `success_requires_verified_local_file`, `secret_read_boundary`, and `stop_after_generation`. | Partial. Runner sandbox validates persistence normalization; no complete authorization document schema validator exists. |
| human_review_artifacts | `reviews/v7_282_matte_ceramic_mug_v4_human_review.md`; `reviews/v8_034_multi_color_mesh_sports_visor_v2_human_review.md`; `docs/archive/phases/v10/v10_012_human_review_of_third_product_first_real_output.md` | `asset_status`, `accepted_candidate`, `commercial_delivery_ready`, `memory_suitability`, strengths, watch items, and safety boundaries are present. V8/V10 add local persistence context more clearly. | Serum review lives under `docs/` while mug and visor reviews live under `reviews/`; `reviewable_sample`, `local_files_verified_count`, and `local_persistence_success` are not uniform across all review artifacts. | Human review has become more structured over time, especially after output persistence guard work. | Define a human review schema with `reviewed_output`, `product`, `asset_status`, `accepted_candidate`, `commercial_delivery_ready`, `memory_suitability`, `reviewable_sample`, `local_persistence_verified`, `scores`, `strengths`, `watch_items`, and `next_gate`. | Partial. Existing validators catch project status and post-push wording, not review field completeness. |
| accepted_candidate_evidence_package_artifacts | `docs/accepted_candidate_evidence_package_matte_ceramic_mug_v1.md`; `docs/accepted_candidate_evidence_package_multi_color_mesh_sports_visor_v1.md`; `docs/accepted_candidate_evidence_package_premium_serum_bottle_v1.md` | `accepted_candidate: true`, `commercial_delivery_ready: false`, `memory_suitability: deferred`, source output reference, prompt lineage, no accepted_samples write, no runs output commit, and no production start are consistently represented. | Field names vary: `accepted_candidate_path` vs `source_output`, `source_prompt_package` vs `prompt_package`, and production status keys differ slightly. | Evidence packages are semantically aligned but not yet schema-normalized. | Define a canonical evidence package schema with stable keys for `product`, `source_output`, `prompt_package`, `source_generation_phase`, `human_review_phase`, `accepted_candidate`, `commercial_delivery_ready`, `memory_suitability`, `evidence_summary`, and `safety`. | Partial. Current validators can detect status surface issues, but not evidence package key drift. |
| delivery_readiness_commercial_review_artifacts | `docs/delivery_readiness_package_matte_ceramic_mug_v4.md`; `docs/delivery_readiness_package_multi_color_mesh_sports_visor_v8_033.md`; `docs/commercial_delivery_review_plan_matte_ceramic_mug_v4.md`; `docs/commercial_delivery_review_plan_multi_color_mesh_sports_visor_v8_033.md`; `reviews/v9_007_ceramic_mug_v4_commercial_delivery_review.md`; `reviews/v9_019_sports_visor_v8_033_commercial_delivery_review.md` | Delivery packages separate accepted candidate status from commercial delivery readiness, keep output references as ignored `runs/` paths, and list QA/export/handoff checks. | Premium serum bottle has accepted candidate evidence but no delivery readiness package yet. Delivery and commercial review field names are not unified across products. | V9 focused on ceramic mug and sports visor delivery readiness; V10 serum bottle stopped at evidence package. | Define delivery readiness schema with `candidate_source`, `asset_status`, `commercial_delivery_ready`, `export_spec`, `qa_checklist`, `client_review_package`, `retouch_plan`, `blocked_items`, and `no_asset_copy_policy`. | Partial. MVP/local validators cover safety rails but not delivery package completeness. |
| route_closeout_artifacts | `docs/archive/phases/v7/v7_product_loop_closeout_matte_ceramic_mug_v1.md`; `docs/v8_final_retouch_route_closeout_matte_ceramic_mug_v4.md`; `docs/archive/phases/v10/v10_third_product_route_closeout_premium_serum_bottle.md`; `docs/archive/phases/v10/v10_product_loop_final_closeout.md` | Route closeouts record route result, accepted candidate state, commercial delivery boundary, memory boundary, production boundary, and recommended next phase. | Route closeout naming and depth vary by V7/V8/V10 route type; route result fields are semantically consistent but not key-normalized. | V8 and V10 closeouts have richer route-level proof and safety fields than earlier product loop records. | Define route closeout schema with `route_id`, `route_goal_met`, `accepted_candidate_created`, `commercial_delivery_ready`, `memory_suitability`, `production_started`, `evidence_refs`, `validation_refs`, `remaining_gaps`, and `recommended_next`. | Partial. `validate_agent_board_state.js` now guards synced status wording, but closeout schemas are not field-validated. |

## Focus Checks

```yaml
prompt_positive_prompt_sync:
  current_state: partially_stable
  evidence:
    - sports_visor_v2_has_prompt_and_positive_prompt
    - serum_bottle_v1_has_prompt_and_positive_prompt
    - ceramic_mug_v4_has_prompt_without_positive_prompt
  recommended_action: require runner-facing prompt and define positive_prompt retention/sync rules

yaml_block_shape:
  current_state: mostly_stable
  evidence:
    - prompt: pipe blocks appear in active prompt packages
    - negative_prompt: pipe blocks appear in active prompt packages
    - positive_prompt: pipe blocks appear in later packages
  recommended_action: validate prompt, positive_prompt, and negative_prompt as independent YAML block scalars

product_identity_structure_material:
  current_state: improving_but_not_normalized
  evidence:
    - serum_bottle_v1_has_product_identity_structure_lock_material_texture_constraints
    - sports_visor_v2_has_product_identity_open_top_structure_and_mesh_material_controls
    - mug_v4_uses_control_groups_without_common_schema_keys
  recommended_action: normalize identity_lock, structure_lock, and material_constraints fields

A5_authorization_vs_execution:
  current_state: improving
  evidence:
    - v10_009_authorization_draft_and_v10_010_execution_confirmation_are_separate
    - older_gates_can_mix_refinement_context_with_authorization_boundary
  recommended_action: separate authorization draft, execution confirmation, execution closeout, and human review schemas

local_persistence_verification:
  current_state: stable_after_v8_030
  evidence:
    - output_persistence_guard_fixed
    - later execution records require verified local file count
  recommended_action: require local_files_verified_count and local_persistence_success in execution closeout and human review schemas

accepted_candidate_vs_commercial_delivery_ready:
  current_state: stable
  evidence:
    - accepted_candidate_true_can_coexist_with_commercial_delivery_ready_false
    - evidence_packages_preserve_commercial_delivery_boundary
  recommended_action: keep fields separate and forbid automatic promotion

memory_suitability:
  current_state: stable_deferred
  evidence:
    - memory_suitability_remains_deferred_across_accepted_candidate_packages
    - memory_write_performed_false
  recommended_action: require explicit memory_suitability and memory_write_performed fields

runs_output_and_accepted_samples:
  current_state: stable_boundary
  evidence:
    - output_image_added_to_git_false
    - runs_output_committed_false
    - accepted_samples_written_false
  recommended_action: keep safety fields in every evidence, review, delivery, and closeout schema

post_push_status_wording:
  current_state: guarded
  evidence:
    - v10_016_added_validator_guard
    - current_status_surfaces_use_completed_remote_synced_after_guarded_push
  recommended_action: retain validator coverage for synced current-phase statuses
```

## Validation Gap Summary

Machine validation is available for:

- Native Doubao sandbox persistence behavior.
- `.agent_board` state consistency and post-push status wording.
- Current state alignment.
- Project local validation and MVP validation.

Machine validation is not yet available for:

- Full product brief required fields.
- Full prompt package schema fields.
- Static review checklist completeness.
- A5 authorization and execution confirmation document shape.
- Human review field completeness.
- Accepted candidate evidence package key normalization.
- Delivery readiness package completeness.
- Route closeout field normalization.

These gaps should drive v11.004 and later schema hardening work.
