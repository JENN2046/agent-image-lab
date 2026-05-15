# v11.014 Accepted Candidate Evidence Package Schema Draft Gate

```yaml
gate_template:
  phase: v11_014_accepted_candidate_evidence_package_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/v11_014_accepted_candidate_evidence_package_schema_draft_gate.md
    - docs/accepted_candidate_evidence_package_canonical_schema.md
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
    - draft accepted candidate evidence package canonical schema
    - record key drift normalization
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
    - runs output commit
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - evidence package migration
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
    message: docs: draft accepted candidate evidence package schema
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

V11.014 drafts [accepted_candidate_evidence_package_canonical_schema.md](accepted_candidate_evidence_package_canonical_schema.md) from the v11.003 inventory and representative evidence packages for the ceramic mug, sports visor, and premium serum bottle routes. This gate normalizes evidence package field drift only. It does not migrate existing packages, copy output images, write `accepted_samples/`, write memory, promote production, or change commercial delivery readiness.

## Source Inventory Findings

```yaml
source_inventory:
  inventory_ref: docs/prompt_artifact_schema_inventory.md
  representative_files:
    - docs/accepted_candidate_evidence_package_matte_ceramic_mug_v1.md
    - docs/accepted_candidate_evidence_package_multi_color_mesh_sports_visor_v1.md
    - docs/accepted_candidate_evidence_package_premium_serum_bottle_v1.md
  stable_semantics:
    accepted_candidate: true
    commercial_delivery_ready: false
    memory_suitability: deferred
    output_image_added_to_git: false
    accepted_samples_written: false
    memory_write_performed: false
    production_candidate_002_started: false
  key_drift_examples:
    accepted_candidate_path_vs_source_output: true
    source_prompt_package_vs_prompt_package: true
    production_status_key_variation: true
```

## Schema Draft Result

```yaml
schema_draft:
  drafted_schema: docs/accepted_candidate_evidence_package_canonical_schema.md
  source_inventory: docs/prompt_artifact_schema_inventory.md
  phase_record: docs/v11_014_accepted_candidate_evidence_package_schema_draft_gate.md
  accepted_candidate_evidence_package_schema_drafted: true
  source_output_canonical_field_defined: true
  prompt_package_canonical_field_defined: true
  lineage_schema_defined: true
  evidence_summary_schema_defined: true
  commercial_delivery_boundary_defined: true
  memory_boundary_defined: true
  accepted_samples_and_runs_output_boundary_defined: true
  production_candidate_boundary_defined: true
  validation_strategy_defined: true
  machine_validator_implemented: false
  evidence_package_migration_performed: false
```

## Drift Coverage

| drift risk | schema response |
|---|---|
| `accepted_candidate_path` vs `source_output` | `source_output` is canonical; legacy `accepted_candidate_path` becomes a warning. |
| `source_prompt_package` vs `prompt_package` | `prompt_package` is canonical; legacy `source_prompt_package` becomes a warning. |
| Accepted candidate mistaken for delivery readiness | `accepted_candidate: true` and `commercial_delivery_ready: false` are separate required decisions. |
| Memory suitability inferred from accepted candidate | `memory_suitability` is explicit and future memory write requires independent authorization. |
| Evidence package used as promotion gate | Production, memory, delivery, accepted_samples, and runs output fields remain false. |
| Missing minor watch items | `minor_watch_items` are required for downstream delivery readiness or prompt revision. |

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
  evidence_package_migration_performed: false
  commercial_delivery_ready_changed: false
  memory_write_performed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_015_accepted_candidate_evidence_package_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 accepted candidate evidence package canonical schema 是否覆盖 v11.003 inventory 中的 evidence package 漂移；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_014_accepted_candidate_evidence_package_schema_draft_gate
  commit_message: "docs: draft accepted candidate evidence package schema"
  branch: master
  source_commit: c74a3f7d3f2db9fe1671a1acbcf00b3e9d089b5c
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
