# Full Asset Archive Verified Git-Tracked Baseline Gate

```yaml
gate_template:
  phase: full_asset_archive_verified_git_tracked_baseline_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  allowed_files:
    - docs/FULL_ASSET_ARCHIVE_VERIFIED_GIT_TRACKED_BASELINE_GATE.md
    - docs/FULL_ASSET_ARCHIVE_DESIGN.md
    - schemas/full_asset_archive_manifest.schema.yaml
    - tests/schema_examples/full_asset_archive_manifest.example.json
    - scripts/validate_full_asset_archive_manifest.js
    - docs/00_project_roadmap.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_actions:
    - new A5 execution
    - runs mutation
    - source image binary read
    - new hash extraction
    - new dimensions extraction
    - preview generation
    - provider/plugin/API call
    - DailyNote/VCP memory write
    - production candidate write
    - dependency change
    - push/tag/release/deploy
```

## Objective

Align the full asset archive design, schema example, and static validator with
the current repository reality: the project now has a verified durable-original
baseline under `asset_archive/original_assets/by_sha256/`, backed by an exact
execution report and a checked-in Git tracking policy.

## Current Drift Closed

Before this gate:

- `docs/FULL_ASSET_ARCHIVE_DESIGN.md` still described the original asset layer
  as outside Git by default with no verified durable-original Git state.
- `tests/schema_examples/full_asset_archive_manifest.example.json` only modeled
  the blocked pre-A5 state.
- `scripts/validate_full_asset_archive_manifest.js` only accepted
  `verification_status=blocked_until_A5_authorization`.

Current repository evidence already proves a narrower verified state:

- `docs/ASSET_ARCHIVE_GIT_TRACKING_POLICY.md`
- `reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json`
- `asset_archive/original_assets/by_sha256/*.jpg`

## Decision

The full asset archive model now supports two legitimate states:

```yaml
supported_states:
  blocked_pre_A5:
    meaning: preview capsule is portable, original asset evidence is still blocked
  verified_git_tracked_durable_archive:
    meaning: exact A5 copy/verify already happened and the durable original is now tracked in Git under asset_archive/original_assets/by_sha256/
```

The checked-in example now represents the second state so the model reflects the
current baseline instead of only the earlier blocked draft.

## Validation

```yaml
required:
  - node --check scripts/validate_full_asset_archive_manifest.js
  - node scripts/validate_full_asset_archive_manifest.js
  - git diff --check
  - node scripts/validate_agent_board_state.js
  - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
  - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

## Boundary Confirmation

```yaml
new_A5_execution_performed: false
runs_mutation_performed: false
source_image_binary_read_performed: false
hash_extraction_performed: false
dimensions_extraction_performed: false
preview_generation_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
production_candidate_write_performed: false
push_tag_release_deploy_performed: false
```

## Recommended Next

```yaml
recommended_next:
  phase: review_console_full_asset_archive_baseline_bridge_gate
  mode: A4.8 static / no runtime
  objective: expose the verified durable-original baseline in the static Review Console without reading files in-browser or crossing any A5/runtime boundary
```
