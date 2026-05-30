# AIL-VIS-21 Accepted Sample Promotion Authorization Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-21_accepted_sample_promotion_authorization_gate`
Mode: `docs_only_promotion_authorization_gate`
Risk: `high`

## Purpose

This phase drafts the authorization boundary for possible future accepted-sample
promotion of the headphones image.

It defines the promotion boundary only. It does not copy files, create
accepted-sample records, promote the image, create memory candidates, or write
memory.

## Source Context

This authorization gate follows the accepted-sample candidate review:

- `AIL-VIS-20_accepted_sample_candidate_review_gate`
  - commit: `9458d74523bd56ac393390ee1cde5a6ff6015e58`
  - branch: `ail-vis-20-accepted-sample-candidate-review`
  - candidate status: `accepted_sample_candidate`
  - accepted sample created: `false`
  - accepted sample promoted: `false`
  - accepted sample file created: `false`
  - memory candidate created: `false`

## Promotion Boundary

```yaml
promotion_boundary:
  source_image:
    path: A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\ail_vis_17_premium_black_wireless_headphones_hero\ail_vis_17_premium_black_wireless_headphones_hero_01.png
    sha256: 8954A5404BC6A296B6D86091A9DAB46E048CEC1DECB55CCA07B5B12FBA3C203E
  candidate_status: accepted_sample_candidate
  proposed_future_action: accepted_sample_promotion
  allowed_now: false
  requires_explicit_owner_authorization: true
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
```

## Future Authorization Phrase Template

```text
我明确授权 AIL-VIS-21 执行 accepted sample promotion，
目标图像为 A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\ail_vis_17_premium_black_wireless_headphones_hero\ail_vis_17_premium_black_wireless_headphones_hero_01.png，
SHA256 为 8954A5404BC6A296B6D86091A9DAB46E048CEC1DECB55CCA07B5B12FBA3C203E，
允许创建 accepted sample metadata / record，
允许复制或登记到 <明确 accepted_samples 目标路径>，
不允许 memory write，
不允许 production_candidate_002，
不允许 Batch 005。
```

## Boundary Checks

- `image_generated: false`
- `image_edited: false`
- `accepted_sample_created: false`
- `accepted_sample_promoted: false`
- `accepted_sample_file_created: false`
- `image_copied_into_accepted_samples: false`
- `accepted_sample_metadata_created: false`
- `memory_candidate_created: false`
- `actual_memory_write_performed: false`
- `production_candidate_002_started: false`
- `batch_005_started: false`
- `git_add_dot_used: false`

## Forbidden Actions

This phase forbids:

- image generation
- retry generation
- image editing
- provider call
- plugin call
- API call
- runtime execution
- accepted sample promotion
- accepted sample file creation
- copying image into accepted_samples
- accepted sample metadata creation
- memory candidate creation
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Final State

- `accepted_sample_promotion_allowed_now: false`
- `memory_write_allowed_now: false`
- `production_candidate_002_allowed_now: false`
- `next_phase_started: false`

## Selected Next State

The next allowed phase is `AIL-VIS-22_accepted_sample_promotion_execution_gate` only
after explicit owner authorization is provided.

## Closeout YAML Template

```yaml
AIL_VIS_21_accepted_sample_promotion_closeout:
  phase_name: AIL-VIS-21_accepted_sample_promotion_authorization_gate
  source_phase: AIL-VIS-20_accepted_sample_candidate_review_gate
  source_commit: 9458d74523bd56ac393390ee1cde5a6ff6015e58
  candidate_status: accepted_sample_candidate
  accepted_sample_promotion_gate_created: true
  accepted_sample_promotion_allowed_now: false
  owner_authorization_required: true
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
  next_phase_started: false
```
