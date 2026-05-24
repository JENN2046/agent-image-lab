# V0.6.32 Exact New-Trial 003 Human Review

Status: `completed_validated_local_candidate_selection_pending_formal_human_approval`

## Purpose

- Compare the three completed `exact_new_trial_003` samples side by side after
  the `3/3 executed shots` route finished.
- Select one truthful preferred candidate for the next human-approval intake
  step without claiming that formal human approval already happened.
- Preserve the no-promotion boundary: no accepted-sample write, archive write,
  production-candidate write, DailyNote write, or VCP memory write.

## Compared Candidates

- `shot_1`
  - `attempt_id: v0_3_3_exact_new_trial_003_shot_1`
  - `sha256: 07a4ddc934c6e7ed88deefa9a1de6c8d06eb4407f4858f6688411dfa2bf60840`
  - Strength: strongest full-body vertical framing.
  - Watch item: no literal pre-call payload capture; top reads slightly more
    open; one hand still in pocket.
- `shot_2`
  - `attempt_id: v0_3_3_exact_new_trial_003_shot_2`
  - `sha256: 8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b`
  - Strength: best professional balance across face, framing, wardrobe
    conservatism, and literal pre-call payload truth.
  - Watch item: one hand remains in pocket and the white top is still slightly
    lower-cut than the most conservative prompt reading.
- `shot_3`
  - `attempt_id: v0_3_3_exact_new_trial_003_shot_3`
  - `sha256: c3f69ce85eb2fa1d7e92fe0bc0c493a13fb830ea9fd10d2e5d73056e33e143a7`
  - Strength: warm expression and strong dusk skyline atmosphere.
  - Watch item: crop and styling read a bit more casual than `shot_2` for the
    current editorial-professional target.

## Review Decision

- Preferred candidate now: `shot_2`
- Selection truth:
  - Local visual review was completed now.
  - Preferred-candidate selection was completed now.
  - Formal human approval was not captured now.
  - Commercial delivery is still blocked.
  - Memory suitability remains `deferred`.

## Why Shot 2

- It gives the most stable professional/editorial read across face, posture,
  wardrobe, and terrace background.
- It preserves literal pre-call payload capture truth, unlike `shot_1`.
- It presents the lowest styling-risk profile among the three current
  candidates while still matching the requested portrait class clearly.

## Boundary State

- `provider_call_performed: false`
- `image_generation_performed: false`
- `accepted_sample_auto_promotion: false`
- `archive_write_performed: false`
- `production_candidate_created: false`
- `DailyNote_write_performed: false`
- `VCP_memory_write_performed: false`
- `push_performed: false`

## Recommended Next

- Prepare a formal human-approval intake around the selected `shot_2`
  candidate before any promotion, archive, or memory path.
