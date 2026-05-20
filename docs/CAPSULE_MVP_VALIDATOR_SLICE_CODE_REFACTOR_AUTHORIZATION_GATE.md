# Capsule MVP Validator Slice Code Refactor Authorization Gate

```yaml
gate_template:
  phase: capsule_mvp_validator_slice_code_refactor_authorization_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R2
  allowed_files:
    - docs/CAPSULE_MVP_VALIDATOR_SLICE_CODE_REFACTOR_AUTHORIZATION_GATE.md
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
    - asset_archive/**/*.png
    - asset_archive/**/*.jpg
    - asset_archive/**/*.jpeg
    - asset_archive/**/*.webp
    - package.json
    - package-lock.json
  allowed_actions:
    - turn the docs-first slice plan into an exact future code-refactor authorization package
    - preserve scripts/validate_mvp.ps1 as the top-level validator
    - define exact future write set and validation commands
    - keep code refactor authorization inactive until explicitly opened
  forbidden_actions:
    - edit scripts/validate_mvp.ps1 in this gate
    - create scripts/validate_mvp_capsule_product_core.ps1 in this gate
    - change any validator behavior
    - skip or loosen any capsule product-core check
    - actual runs scan
    - image binary reads
    - hash or dimensions extraction
    - preview generation
    - provider/plugin/API call
    - DailyNote/VCP memory write
    - production candidate
    - dependency change
    - runtime/browser execution
  validation:
    required:
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
    forbidden:
      - runtime/browser validation
      - actual runs scan
      - image binary/hash/dimensions/preview validation
      - provider/plugin/API/DailyNote/VCP memory calls
  commit:
    allowed: true
    message: "docs: gate capsule MVP validator slice refactor"
  push:
    allowed: true
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Objective

Convert the completed docs-first slice plan into the smallest explicit
authorization gate for a later local code refactor.

This gate does not perform the refactor. It only defines the future write set,
proof obligations, stop conditions, and exact validation story needed before
the code move can safely happen.

## Authorization State

```yaml
authorization_state: draft_ready_not_active
code_refactor_authorized_now: false
local_commit_and_push_authorized_for_this_docs_gate: true
future_code_refactor_requires_separate_explicit_instruction: true
```

The updated thread objective allows guarded local commit and push for safe A4.8
work today. That authorization is limited to this docs-only gate and its
`.agent_board` sync. It does not authorize editing `scripts/validate_mvp.ps1`
or adding the helper script.

## Future Code Refactor Package

The later implementation gate may proceed only if a separate explicit
instruction authorizes this exact package:

```yaml
future_authorization_package:
  phase: capsule_mvp_validator_slice_code_refactor
  mode: A4.8 local implementation
  exact_allowed_files:
    - scripts/validate_mvp.ps1
    - scripts/validate_mvp_capsule_product_core.ps1
    - docs/CAPSULE_MVP_VALIDATOR_SLICE_PLAN.md
    - docs/CAPSULE_MVP_VALIDATOR_SLICE_CODE_REFACTOR_AUTHORIZATION_GATE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  exact_forbidden_files:
    - package.json
    - package-lock.json
    - schemas/**
    - review_console/**
    - runs/**
    - asset_archive/**/*.png
    - asset_archive/**/*.jpg
    - asset_archive/**/*.jpeg
    - asset_archive/**/*.webp
  allowed_operations:
    - create scripts/validate_mvp_capsule_product_core.ps1
    - move the current capsule product-core validation cluster without changing semantics
    - dot-source the helper from scripts/validate_mvp.ps1
    - call Invoke-CapsuleProductCoreValidation from the original cluster position
    - keep runs stewardship validators in scripts/validate_mvp.ps1 for the first slice
  forbidden_operations:
    - remove any current capsule validator command
    - weaken any Add-Failure assertion
    - convert failures into warnings
    - change accepted/failure/total expectations
    - change guard false assertions
    - add dependencies
    - read or write real runs artifacts
    - read image binaries or extract hashes/dimensions
    - create previews
    - call provider/plugin/API/DailyNote/VCP memory
    - run browser/runtime validation
```

## Future Required Validation

The implementation gate must prove semantic preservation with the current
project validators:

```yaml
required_commands:
  - pwsh -NoProfile -Command 'git status --short --branch'
  - pwsh -NoProfile -Command 'git diff --check'
  - pwsh -NoProfile -Command 'node scripts/validate_agent_board_state.js'
  - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
  - pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
commit_readiness_commands:
  - pwsh -NoProfile -Command 'git diff --stat'
  - pwsh -NoProfile -Command 'git diff'
  - pwsh -NoProfile -Command 'git diff --cached --check'
  - pwsh -NoProfile -Command 'git diff --cached --name-only'
  - pwsh -NoProfile -Command 'git diff --cached --stat'
```

If `scripts/validate_mvp.ps1` fails after the extraction and the fix is not an
obvious mechanical move error inside the exact allowed files, the
implementation gate must stop instead of broadening scope.

## Pass Conditions

```yaml
pass_conditions:
  - scripts/validate_mvp.ps1 remains the stable human-facing validation entrypoint
  - helper is local PowerShell only
  - helper receives Root and AddFailure from the top-level orchestrator
  - capsule validator command order is preserved
  - immediate LASTEXITCODE checks are preserved
  - ConvertFrom-Json parsing behavior is preserved
  - current Add-Failure message text is preserved unless a later review names an exact text-only correction
  - no dependency manifest or lockfile changes
  - no image/runs/runtime/provider/plugin/API/memory/production action
```

## Stop Conditions

```yaml
stop_conditions:
  - need to inspect real VCPChat/VCPToolBox or real plugin manifest
  - need to read .env, token, cookie, or private config
  - need to scan actual runs/ data
  - need to read image binaries or extract hash/dimensions
  - need to generate/copy/convert previews
  - need to change dependencies
  - test failure suggests a semantic decision rather than a mechanical move error
  - changed files escape the exact allowed set
```

## Recommended Next

```yaml
recommended_next:
  phase: capsule_mvp_validator_slice_code_refactor
  default_state: blocked_until_explicit_code_refactor_authorization
  safe_alternative: commit_and_push_this_docs_gate_if_validation_and_preflight_pass
```
