# P5 Failure Sample Evidence Track Dry Run

base_contract: AGENTS.md
mode: A4.8 docs-only evidence design
status: prepared_validated_no_execution

## Purpose

Define the failure sample evidence lane so Agent Image Lab can learn from
rejected or blocked outputs without promoting them to accepted samples,
production candidates, DailyNote, or VCP memory.

## Proposed Capsule Shape

```text
asset_archive/failure_samples/<sample_id>/
  manifest.json
  preview.webp
  failure_record.json
  review_record.json
```

Minimum manifest fields:

```yaml
manifest_type: git_portable_failure_preview_capsule_manifest
version: v1
sample_id: <sample_id>
artifact.preview.path: preview.webp
artifact.preview.format: webp
artifact.preview.long_edge: 512
artifact.preview.sha256: <preview_sha256>
failure.failure_record: failure_record.json
chain.review_record: review_record.json
production_candidate_allowed: false
memory_write_allowed: false
DailyNote_write_allowed: false
```

## Future Authorization Gate Requirements

- exact failure `sample_id`
- exact source image path, if any
- exact review or rejection evidence ref
- exact target capsule path
- explicit statement that failure sample is never a production candidate
- exact validation commands
- rollback plan
- stop conditions for missing source, missing review, overwrite risk, or any
  external/runtime action

## Non-Authorization

- no failure sample file creation by this dry run
- no `preview.webp` creation, copy, conversion, or generation
- no provider, plugin, API, or image generation
- no DailyNote or VCP memory write
- no runtime, real manifest, VCPChat, or VCPToolBox read
- no accepted_samples write
- no production candidate
- no push, tag, release, or deploy
