# Accepted Candidate Evidence Package - Matte Ceramic Mug v1

```yaml
package_id: accepted_candidate_evidence_package_matte_ceramic_mug_v1
product: matte_ceramic_mug
source_phase: v7.284_accepted_candidate_evidence_package
current_route: keep_v4_and_stop_generation
```

## Candidate

```yaml
accepted_candidate_path: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_written: false
output_image_added_to_git: false
```

## Evidence Summary

The V7 product loop produced four real matte ceramic mug outputs. v1 proved the pipeline and subject but needed revision. v2 became the first accepted candidate. v3 improved some artifacts but regressed handle geometry. v4 restored the stable v2 composition while improving handle credibility enough to become the current best accepted candidate.

## Prompt And Review Chain

| Step | Prompt / Output | Review Result | Decision |
|---|---|---|---|
| v1 prompt / v7.269 output | `runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg` | `needs_revision` | Revise prompt for scale, top whitespace, lighting, background depth, rim/handle clarity, and speck control. |
| v2 prompt / v7.274 output | `runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg` | `accepted_candidate_with_minor_retouch` | Strong improvement; candidate accepted but not final commercial ready. |
| v3 prompt / v7.277 output | `runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg` | `needs_revision` | Rejected as current candidate because handle attachment geometry regressed. |
| v4 prompt / v7.281 output | `runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg` | `accepted_candidate_with_minor_retouch` | Current best candidate; keep v4 and stop generation. |

## Why v4 Is Accepted

- It preserves the successful v2 composition and product scale.
- It improves the v3 handle-geometry regression.
- It keeps the product readable as a matte ceramic mug.
- It improves cup rim cleanliness and warm-gray background quality.
- It largely resolves the colored speck issue.
- It is close enough to ecommerce main-image use to retain as an accepted candidate after minor retouch planning.

## Remaining Retouch Notes

- Clean up slight dark/soft area around the upper handle attachment.
- Refine handle/body connection realism.
- Lift background transparency slightly.
- Add a little more ceramic surface microtexture.
- Refine the bottom contact shadow.

## Explicit Non-Promotion

```yaml
commercial_delivery_ready: false
accepted_samples_written: false
production_candidate_002: false
memory_write_performed: false
DailyNote_write: false
VCP_memory_write: false
```

This package records evidence only. It does not promote the output to `accepted_samples/`, does not write memory, and does not authorize production candidate creation.

## Future Authorization Requirements

```yaml
future_memory_write_requires_independent_authorization: true
future_production_candidate_002_requires_independent_authorization: true
future_fifth_generation_requires_independent_authorization: true
```
