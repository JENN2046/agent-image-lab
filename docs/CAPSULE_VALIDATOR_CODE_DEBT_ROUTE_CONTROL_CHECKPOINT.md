# Capsule Validator Code Debt Route Control Checkpoint

```yaml
gate_template:
  phase: capsule_validator_code_debt_route_control_checkpoint
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  allowed_files:
    - docs/CAPSULE_VALIDATOR_CODE_DEBT_ROUTE_CONTROL_CHECKPOINT.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_files:
    - scripts/validate_mvp.ps1
    - scripts/validate_mvp_capsule_product_core.ps1
    - scripts/**/*.js
    - schemas/**
    - review_console/**
    - runs/**
    - asset_archive/**
    - package.json
    - package-lock.json
  allowed_actions:
    - summarize sealed validator/code-debt route
    - correct post-push route state in .agent_board
    - keep next implementation blocked until explicit code-refactor authorization
  forbidden_actions:
    - code refactor
    - dependency change
    - runtime/browser execution
    - actual runs scan
    - image binary reads
    - hash or dimensions extraction
    - preview generation
    - provider/plugin/API call
    - DailyNote/VCP memory write
    - production candidate
    - tag/release/deploy
  commit:
    allowed: true
    message: "docs: control capsule validator debt route"
  push:
    allowed: true
```

## Route State

The capsule product core validator/code-debt route is back on a narrow rail:

```yaml
sealed_chain:
  - 38f1808 docs: audit capsule code debt
  - 25c8afc docs: plan capsule MVP validator slice
  - 58fa49f docs: gate capsule MVP validator slice refactor
current_branch: master
current_remote: origin/master
route_focus: capsule_product_core_validator_debt
route_status: docs_first_and_authorization_ready
code_refactor_status: blocked_until_separate_explicit_authorization
```

This checkpoint is not another broad planning layer. It is a route-control
record that prevents the next step from drifting into unrelated governance,
runs stewardship, BHA adaptation, Review Console polish, or production/A5 work.

## What Is Sealed

```yaml
sealed:
  code_debt_audit:
    doc: docs/CAPSULE_CODE_DEBT_AUDIT.md
    result: validate_mvp.ps1 is the highest-friction validator surface
  docs_first_slice_plan:
    doc: docs/CAPSULE_MVP_VALIDATOR_SLICE_PLAN.md
    result: first safe slice is capsule product-core extraction into a local PowerShell helper
  authorization_gate:
    doc: docs/CAPSULE_MVP_VALIDATOR_SLICE_CODE_REFACTOR_AUTHORIZATION_GATE.md
    result: exact future write set, forbidden paths, validation commands, pass conditions, and stop conditions are defined
```

## Route Locks

```yaml
route_locks:
  stay_on_capsule_product_core: true
  do_not_start_new_governance_branch: true
  do_not_restart_runs_stewardship_branch: true
  do_not_enter_A5: true
  do_not_run_runtime_or_browser: true
  do_not_scan_actual_runs: true
  do_not_read_image_binaries: true
  do_not_extract_hash_or_dimensions: true
  do_not_generate_preview: true
  do_not_call_provider_plugin_api: true
  do_not_write_DailyNote_or_VCP_memory: true
  do_not_change_dependencies: true
  do_not_create_production_candidate: true
  do_not_tag_release_deploy: true
```

## Next Decision

There is exactly one useful next product-core move:

```yaml
recommended_next:
  phase: capsule_mvp_validator_slice_code_refactor
  state: blocked_until_explicit_code_refactor_authorization
  required_user_intent: authorize the exact local code refactor package from docs/CAPSULE_MVP_VALIDATOR_SLICE_CODE_REFACTOR_AUTHORIZATION_GATE.md
  not_satisfied_by:
    - continue
    - go ahead
    - keep going
    - route-control checkpoint
    - commit/push authorization
```

If that authorization is not provided, the safe route is to stop after this
checkpoint rather than invent a new adjacent gate.

## Closeout Expectation

This checkpoint should validate as docs-only:

```yaml
validation:
  required:
    - git diff --check
    - node scripts/validate_agent_board_state.js
    - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
  not_required:
    - scripts/validate_mvp.ps1
  reason_validate_mvp_not_required: docs-only post-push route-control state sync with no code, schema, validator, README, roadmap, or package changes
```
