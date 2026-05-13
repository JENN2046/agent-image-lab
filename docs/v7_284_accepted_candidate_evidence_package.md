# v7.284 Accepted Candidate Evidence Package

```yaml
phase: v7.284_accepted_candidate_evidence_package
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v7.283_candidate_acceptance_or_final_retouch_decision_gate
source_commit: f3b8a05ab69f64795e18bf5e0f50fc383b268d3e
route: keep_v4_and_stop_generation
```

## Purpose

This phase seals the accepted-candidate evidence package for the first V7 real product image loop. It is documentation only. It does not generate images, contact providers, call plugins, retry, write memory, write DailyNote, write VCP memory, write `accepted_samples/`, start `production_candidate_002`, or add any `runs/` output image to Git.

## Accepted Candidate

```yaml
accepted_candidate_path: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
output_image_added_to_git: false
accepted_samples_written: false
memory_write_performed: false
```

The v4 output is the current accepted candidate with minor retouch needs. It is not final commercial delivery ready and it is not promoted into `accepted_samples/`.

## Prompt Evolution Summary

```text
v1: Baseline matte ceramic mug prompt. It established the product, warm-white matte ceramic material, three-quarter view, soft studio light, no text/logo/people, and basic handle/rim geometry constraints.

v2: Revision from the first real output. It tightened product scale to roughly 65-75 percent frame height, reduced top whitespace, strengthened premium directional lighting, added warm-gray layered background depth, and added specific controls for rim clarity, handle joint clarity, colored specks, random marks, and color noise.

v3: Minor polish attempt from the v2 accepted-candidate review. It tried to suppress top-left specks, refine rim and handle attachment, improve warm-gray background layering, reduce visible background lines, and strengthen rim light/edge definition. The generated output improved some surface issues but regressed handle geometry.

v4: Handle-geometry refinement from v2 as the stable base and v3 as negative feedback. It preserved v2 composition and scale, restored the product direction, explicitly required realistic smooth ceramic handle geometry and clean upper/lower attachments, and kept artifact controls for colored specks, random pixels, corner artifacts, muddy shadows, and malformed handle joints.
```

## Real Generation Outputs

| Trial | Prompt | Output | Human Review |
|---|---|---|---|
| v7.269 first trial | v1 | `runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg` | `needs_revision`, not accepted, not commercial ready, memory deferred |
| v7.274 second trial | v2 | `runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg` | `accepted_candidate_with_minor_retouch`, accepted candidate, not commercial ready, memory deferred |
| v7.277 third trial | v3 | `runs/real_generation/v7_277_matte_ceramic_mug_v3_trial/native_doubao_1778688750417_0.jpg` | `needs_revision`, not accepted, not commercial ready, memory deferred |
| v7.281 fourth trial | v4 | `runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg` | `accepted_candidate_with_minor_retouch`, accepted candidate, not commercial ready, memory deferred |

## Why v4 Is The Current Best Candidate

- v4 fixed the major v3 regression: the handle structure is clearly better and more credible.
- v4 preserved the stable product scale and composition direction that v2 had achieved.
- v4 improved rim cleanliness and kept the matte ceramic material direction.
- v4 mostly solved the top-left colored speck issue.
- v4 has a more premium warm-gray background than earlier attempts.
- v4 is closer to an ecommerce main-image candidate than v1 and v3.
- v4 still has minor retouch needs, so it remains below final commercial delivery readiness.

## Why Generation Stops Here

The project selected `keep_v4_and_stop_generation` in v7.283. The fourth output is already a valid accepted candidate, and another generation could regress geometry, material, background, or artifact control. The remaining issues are localized retouch/planning issues, not enough to justify automatic fifth generation.

```yaml
generation_stopped: true
fifth_generation_started: false
auto_retry: false
next_generation_requires_separate_authorization: true
```

## Why This Does Not Enter production_candidate_002

v4 is accepted as a candidate, but it is explicitly not commercial delivery ready. It still needs minor retouch around the upper handle attachment, handle/body realism, background transparency, ceramic microtexture, and bottom shadow. `production_candidate_002` would require a separate production-candidate authorization and readiness gate.

```yaml
production_candidate_002: false
future_production_candidate_002_requires_independent_authorization: true
```

## Why Memory Is Not Written

Memory suitability remains deferred. The loop is useful as project evidence, but no DailyNote or VCP memory write is allowed in this phase. A future memory write would require an independent memory authorization package, Chinese DailyNote body rules, and human approval.

```yaml
memory_suitability: deferred
memory_write_performed: false
DailyNote_write: false
VCP_memory_write: false
future_memory_write_requires_independent_authorization: true
```

## Next V7 Closeout Recommendation

```yaml
recommended_next:
  phase: v7.285_v7_product_loop_closeout
  purpose: 封存 V7 第一条真实生成-审片-prompt迭代闭环
  auto_execution_allowed: false
```

## Safety Record

```yaml
provider_contact: false
plugin_call: false
image_generation: false
retry: false
fifth_generation_started: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
accepted_samples_written: false
runs_output_image_staged: false
production_candidate_002: false
Batch_005: false
dependency_change: false
package_json_modified: false
```
