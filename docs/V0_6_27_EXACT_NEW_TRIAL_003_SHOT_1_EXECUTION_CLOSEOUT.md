# v0.6.27 Exact New-Trial 003 Shot 1 Execution Closeout

phase: v0_6_27_exact_new_trial_003_shot_1_execution_closeout
base_contract: AGENTS.md
status: completed_validated_shot_1_execution_closeout

## Purpose

Execute the fresh non-overwriting repair route selected by v0.6.26, verify
that the new output PNG actually persists inside the repository, and record a
truthful closeout for review readiness without pretending the pre-call payload
capture step was satisfied.

This phase performs one real `image_gen.imagegen` call, copies the returned
artifact into the project run directory, reconstructs the sanitized request
payload after the call, and updates only local receipt/report surfaces. It does
not auto-promote the sample, write memory, write DailyNote, create a production
candidate, commit, or push.

## Evidence Produced

- `reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json`
- `runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/generation_attempt_result.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json`
- `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json`
- `reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json`
- `scripts/validate_exact_new_trial_003_shot_1_execution_closeout.js`

## Execution Truth

Selected route:

- source_phase: `v0_6_26_exact_new_trial_local_persistence_repair_preflight`
- selected_shot_id: `v0_3_3_exact_new_trial_003_shot_1`
- provider_route: `image_gen.imagegen`
- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- output_image_path:
  `runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/safe_adult_editorial_portrait_v1.png`

Observed result:

- receipt_status: `succeeded_image_generated`
- local_persistence_success: `true`
- output_image_sha256:
  `07a4ddc934c6e7ed88deefa9a1de6c8d06eb4407f4858f6688411dfa2bf60840`
- output_image_dimensions: `941 x 1672`
- artifact_return_trace_status: `artifact_located_and_copied_to_project`

## Payload Capture Timing Truth

The phase intentionally records a protocol deviation instead of masking it:

- pre_provider_call_payload_capture_required: `true`
- pre_provider_call_payload_capture_satisfied: `false`
- post_provider_call_payload_reconstruction_performed: `true`
- reconstructed_from_same_prompt_package: `true`

That means the project now has a truthful sanitized payload record for
`shot_1`, but it is a reconstructed post-call record, not a literal pre-call
capture.

## Review Outcome

The new artifact restores a reviewable local sample for this route:

- reviewable_sample: `true`
- asset_status: `accepted_candidate_with_minor_watch_items`
- accepted_candidate: `true`
- commercial_delivery_ready: `false`
- memory_suitability: `deferred`

Strengths:

- strong prompt match for subject, wardrobe, portrait orientation, and dusk
  terrace setting
- clean professional lighting with no visible text or watermark
- enough anatomical and stylistic quality for candidate-level review

Watch items:

- the `hands visible` instruction is only partially satisfied because one hand
  remains in a pocket
- the white top is slightly lower-cut than the most conservative reading of the
  text prompt
- one successful shot does not yet complete the planned 3-shot stability proof

## Boundary Confirmation

- provider_call_performed: true
- image_generation_performed: true
- retry_performed: false
- raw_provider_payload_capture_performed: false
- raw_provider_response_capture_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Recommended Next

Prepare `v0_3_3_exact_new_trial_003_shot_2` only after restoring literal
pre-call payload capture discipline and re-running immediate path-collision
checks. Do not treat `shot_1` as memory-ready or commercially delivery-ready,
and do not auto-promote it before the follow-up stability route is defined.
