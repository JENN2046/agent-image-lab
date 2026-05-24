# v0.6.29 Exact New-Trial 003 Shot 2 Execution Closeout

phase: v0_6_29_exact_new_trial_003_shot_2_execution_closeout
base_contract: AGENTS.md
status: completed_validated_shot_2_execution_closeout

## Purpose

Execute the already pre-captured `shot_2` route, verify that the returned PNG
persists inside the repository, and record a truthful closeout that preserves
the literal pre-call payload capture evidence from v0.6.28.

This phase performs one real `image_gen.imagegen` call, copies the returned
artifact into the project run directory, binds it to an independent attempt
result / receipt / registry / bridge history, and records a local review
outcome. It does not auto-promote the sample, write memory, write DailyNote,
create a production candidate, commit, or push.

## Evidence Produced

- `runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/generation_attempt_result.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_registry.json`
- `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2/bridge_entry.json`
- `reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json`
- `scripts/validate_exact_new_trial_003_shot_2_execution_closeout.js`

## Execution Truth

Selected route:

- source_phase: `v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight`
- selected_shot_id: `v0_3_3_exact_new_trial_003_shot_2`
- provider_route: `image_gen.imagegen`
- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- output_image_path:
  `runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png`

Observed result:

- receipt_status: `succeeded_image_generated`
- local_persistence_success: `true`
- output_image_sha256:
  `8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b`
- output_image_dimensions: `941 x 1672`
- artifact_return_trace_status: `artifact_located_and_copied_to_project`

## Payload Capture Timing Truth

This phase preserves the exact payload-capture improvement introduced by
v0.6.28:

- pre_provider_call_payload_capture_required: `true`
- pre_provider_call_payload_capture_satisfied: `true`
- post_provider_call_payload_reconstruction_performed: `false`
- captured_from_same_prompt_package_before_call: `true`

That means `shot_2` is the first fresh exact-repair shot in this sequence with
literal pre-call payload evidence and verified post-write local persistence.

## Review Outcome

The new artifact is reviewable and materially increases route confidence:

- reviewable_sample: `true`
- asset_status: `accepted_candidate_with_minor_watch_items`
- accepted_candidate: `true`
- commercial_delivery_ready: `false`
- memory_suitability: `deferred`

Strengths:

- strong prompt match for subject, red blazer / white top / dark trousers
  wardrobe, dusk terrace setting, and vertical editorial composition
- clean professional lighting with no visible text or watermark
- second independent successful shot improves confidence that the route can
  reproduce the requested portrait class

Watch items:

- the `hands visible` instruction is still only partially satisfied because one
  hand remains in a pocket
- the white top remains slightly lower-cut than the most conservative reading
  of the prompt
- the planned 3-shot stability proof is improved to 2/3 executed shots, but it
  is still not complete

## Boundary Confirmation

- provider_call_performed: true
- image_generation_performed: true
- retry_performed: false
- raw_provider_payload_capture_performed: true
- raw_provider_response_capture_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Recommended Next

Prepare `v0_3_3_exact_new_trial_003_shot_3` only after exact pre-call payload
capture and immediate path-collision recheck are restored for that shot as
well. Do not auto-promote `shot_2`, do not write memory, and do not claim
commercial delivery readiness before the 3-shot route is completed and reviewed.
