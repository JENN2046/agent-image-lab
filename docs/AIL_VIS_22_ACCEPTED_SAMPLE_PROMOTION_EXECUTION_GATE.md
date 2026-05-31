# AIL-VIS-22 Accepted Sample Promotion Execution Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-22_accepted_sample_promotion_execution_gate`
Mode: `docs_only_promotion_execution_gate`
Risk: `high`

## Purpose

This phase drafts the execution boundary for possible future accepted-sample
promotion of the headphones image.

It defines the promotion execution boundary only. It does not copy files,
create accepted-sample records, promote the image, create memory candidates,
or write memory.

## Source Context

This execution gate follows the accepted-sample promotion authorization:

- `AIL-VIS-21_accepted_sample_promotion_authorization_gate`
  - commit: `535963d2bc5187ea692afe72aaf444ea5229ce36`
  - branch: `ail-vis-21-accepted-sample-promotion-authorization`
  - candidate status: `accepted_sample_candidate`
  - accepted sample promotion allowed now: `false`
  - owner authorization required: `true`

## Post-Authorization Apply Status

After this gate was drafted, Jenn supplied explicit AIL-VIS-22 accepted sample
promotion authorization. The follow-up apply step is recorded in `.agent_board`
as `ail_vis_22_accepted_sample_promotion_apply` and in the accepted-sample
metadata surfaces.

```yaml
post_authorization_apply:
  status: completed_validated_local
  sample_id: accepted_premium_black_wireless_headphones_hero_ail_vis_17_001
  accepted_samples_target: accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/
  registry_ref: accepted_samples/accepted_sample_registry.yaml
  category_index_ref: accepted_samples/categories/product_still_life.yaml
  manifest_ref: accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/manifest.json
  metadata_ref: accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/metadata.json
  source_evidence_ref: accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/source_evidence.json
  accepted_sample_created: true
  accepted_sample_promoted: true
  accepted_sample_metadata_created: true
  image_copied_into_accepted_samples: false
  memory_write_performed: false
  production_candidate_002_started: false
  batch_005_started: false
```

The historical boundary below remains the original pre-apply execution gate. It
does not revoke or overwrite the later metadata-only apply record.

## Promotion Execution Boundary

```yaml
promotion_execution_boundary:
  source_image:
    path: A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\ail_vis_17_premium_black_wireless_headphones_hero\ail_vis_17_premium_black_wireless_headphones_hero_01.png
    sha256: 8954a5404bc6a296b6d86091a9dab46e048cec1decb55cca07b5b12fba3c203e
  candidate_status: accepted_sample_candidate
  proposed_future_action: accepted_sample_promotion
  allowed_now: false
  requires_explicit_owner_authorization: true
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
  accepted_sample_file_target: <explicit accepted_samples target path>
```

## Future Execution Authorization Phrase Template

```text
我明确授权 AIL-VIS-22 执行 accepted sample promotion，
目标图像为 A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\ail_vis_17_premium_black_wireless_headphones_hero\ail_vis_17_premium_black_wireless_headphones_hero_01.png，
SHA256 为 8954a5404bc6a296b6d86091a9dab46e048cec1decb55cca07b5b12fba3c203e，
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

This gate does not start the next phase.

If owner authorization is later supplied, the corresponding promotion execution
action may be taken in a separate, explicitly authorized step.

## Closeout YAML Template

```yaml
AIL_VIS_22_accepted_sample_promotion_execution_closeout:
  phase_name: AIL-VIS-22_accepted_sample_promotion_execution_gate
  source_phase: AIL-VIS-21_accepted_sample_promotion_authorization_gate
  source_commit: 535963d2bc5187ea692afe72aaf444ea5229ce36
  candidate_status: accepted_sample_candidate
  accepted_sample_promotion_gate_created: true
  accepted_sample_promotion_allowed_now: false
  owner_authorization_required: true
  memory_write_allowed_now: false
  production_candidate_002_allowed_now: false
  next_phase_started: false
```
