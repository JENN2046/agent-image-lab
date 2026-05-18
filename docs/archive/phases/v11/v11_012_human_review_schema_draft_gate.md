# v11.012 Human Review Schema Draft Gate

```yaml
gate_template:
  phase: v11_012_human_review_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v11/v11_012_human_review_schema_draft_gate.md
    - docs/human_review_canonical_schema.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - reviews/
    - runs/
    - accepted_samples/
    - prompts/image_generation/
    - scripts/
    - plugins/
    - adapters/
    - .env
    - .env.local
    - package.json
    - package-lock.json
  allowed_actions:
    - draft human review canonical schema
    - document validation strategy
    - update local project status surfaces
    - run local validation
    - exact-file staging and guarded local commit
  forbidden_actions:
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - accepted samples write
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - review artifact migration
    - machine validator implementation
  validation:
    required:
      - git status -sb
      - git diff --check
      - exact diff review
      - node scripts/validate_native_doubao_sandbox.js
      - node scripts/validate_agent_board_state.js
      - node scripts/validate_current_state_alignment.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    forbidden:
      - scripts/run_native_doubao_image_generation.js
  commit:
    allowed: true
    message: docs: draft human review canonical schema
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Phase Diff

V11.012 drafts a canonical human review schema from the ceramic mug, sports visor, and serum bottle review records. This gate does not migrate existing reviews, write memory, write accepted samples, promote production, or create delivery-ready status.

## Schema Draft Output

The human review schema draft is recorded in [human_review_canonical_schema.md](human_review_canonical_schema.md).

It defines:

- review identity and reviewed output reference
- product and prompt lineage
- local persistence verification fields
- asset status and decision fields
- separate accepted candidate, commercial delivery, and memory suitability fields
- strengths, watch items, scores, revision focus, and next gate
- safety boundary fields
- validation strategy for future machine checks

## Risk Coverage

```yaml
risk_coverage:
  accepted_candidate_commercial_delivery_ready_confusion: covered
  memory_suitability_auto_inference: covered
  reviewable_sample_missing: covered
  local_persistence_fields_not_uniform: covered
  output_image_git_boundary_missing: covered
  accepted_samples_write_confusion: covered
  production_candidate_confusion: covered
  next_generation_without_authorization_confusion: covered
```

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
  review_artifact_migration_performed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_013_human_review_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 human review canonical schema 是否覆盖 v11.003 inventory 风险；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_012_human_review_schema_draft_gate
  commit_message: "docs: draft human review canonical schema"
  branch: master
  source_commit: 0bc443f71d4f71b8cd198fe7e14089aa747a9bd6
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
