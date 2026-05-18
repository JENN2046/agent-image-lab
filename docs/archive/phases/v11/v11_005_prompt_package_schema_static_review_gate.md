# v11.005 Prompt Package Schema Static Review Gate

```yaml
gate_template:
  phase: v11_005_prompt_package_schema_static_review_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v11/v11_005_prompt_package_schema_static_review_gate.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - prompts/image_generation/
    - schemas/
    - scripts/
    - plugins/
    - adapters/
    - runs/
    - accepted_samples/
    - .env
    - .env.local
    - package.json
    - package-lock.json
  allowed_actions:
    - statically review prompt package canonical schema
    - record coverage and gaps
    - update local project status surfaces
    - run local validation
    - exact-file staging and guarded local commit
  forbidden_actions:
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - runner behavior change
    - prompt package behavior change
    - machine validator implementation
    - A5 generation authorization creation
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
    message: docs: review prompt package canonical schema
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

V11.005 statically reviews [prompt_package_canonical_schema.md](prompt_package_canonical_schema.md) against the v11.003 prompt package inventory findings. It does not edit prompt packages, implement a validator, or create an A5 authorization.

## Static Review Result

```yaml
static_review:
  reviewed_schema: docs/prompt_package_canonical_schema.md
  source_inventory: docs/prompt_artifact_schema_inventory.md
  review_record: docs/archive/phases/v11/v11_005_prompt_package_schema_static_review_gate.md
  result: pass_for_schema_static_review
  prompt_positive_prompt_sync_covered: true
  yaml_literal_block_shape_covered: true
  runner_facing_canonical_field_covered: true
  product_identity_drift_covered: true
  structure_lock_missing_covered: true
  material_constraints_missing_covered: true
  label_fake_text_logo_boundary_covered: true
  A5_authorization_execution_confusion_not_authorized_by_prompt_package: true
  accepted_candidate_commercial_delivery_ready_not_inferred: true
  memory_suitability_not_inferred: true
  runs_output_commit_boundary_covered: true
  post_push_status_wording_guard_referenced: true
```

## Review Checklist

| check | result | evidence |
|---|---|---|
| `prompt` is defined as runner-facing canonical field | pass | `runner_prompt_mapping.canonical_prompt_field: prompt` and `runner_expected_prompt_field: prompt` are required. |
| `positive_prompt` sync risk is handled | pass | New packages require `positive_prompt: |` as review alias and require synchronization unless a phase records an intentional difference. |
| YAML literal block shape is explicit | pass | Required block shape lists independent `prompt: |`, `positive_prompt: |`, and `negative_prompt: |`. |
| Negative prompt is independent | pass | Schema states `negative_prompt` must not be embedded inside positive prompt fields. |
| Product identity drift is addressed | pass | `product_identity.product_type`, `category_terms`, and `must_not_be` are required. |
| Structure lock is addressed | pass | `structure_lock` requires locked structure, required parts, forbidden drift, and extra product policy. |
| Material constraints are addressed | pass | `material_constraints` requires primary material, texture behavior, finish, and forbidden material drift. |
| Scene constraints are addressed | pass | `scene_constraints` separates shot type, usage, environment, background role, people/hands/props boundaries. |
| Label, fake text, and logo boundary is addressed | pass | `text_logo_policy` requires readable logo/text, fake text, watermark, and label area policy fields. |
| A5 authorization vs execution is not collapsed into prompt package | pass | Prompt package only carries `A5_authorization_required_later: true`; it does not authorize execution. |
| Accepted candidate is not inferred from prompt package | pass | Schema states accepted candidate is downstream review data. |
| Commercial delivery ready is not inferred | pass | Schema states commercial delivery readiness is downstream delivery review data. |
| Memory suitability is not inferred | pass | Schema states memory suitability is downstream review/evidence data; safety flags keep memory write false. |
| Runs output / accepted samples boundary is explicit | pass | Safety flags require accepted samples and runs output creation false. |
| Legacy packages are handled conservatively | pass | Migration policy warns on legacy gaps and forbids mechanical rewrite without a new phase. |
| Machine validation strategy exists | pass_with_gap | Static, warning, and failure checks are drafted, but no validator implementation is created in this gate. |

## Remaining Gaps

```yaml
remaining_gaps:
  machine_validator_implemented: false
  actual_prompt_packages_migrated: false
  product_brief_schema_drafted: false
  static_review_schema_drafted: false
  A5_authorization_schema_drafted: false
  human_review_schema_drafted: false
  evidence_package_schema_drafted: false
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
  prompt_package_behavior_changed: false
  runner_behavior_changed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_006_product_brief_schema_draft_gate
  auto_execution_allowed: true
  purpose: 基于 v11.003 inventory 起草 product brief canonical schema；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_005_prompt_package_schema_static_review_gate
  commit_message: "docs: review prompt package canonical schema"
  branch: master
  source_commit: 270dd3af89eb8d932319b4cad16da597127db08c
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
