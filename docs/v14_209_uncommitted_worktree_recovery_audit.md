# v14.209 Uncommitted Worktree Recovery Audit

```yaml
gate_template:
  phase: v14_209_uncommitted_worktree_recovery_audit
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/v14_209_uncommitted_worktree_recovery_audit.md
    - tests/schema_examples/v14_209_uncommitted_worktree_recovery_audit.example.json
    - scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js
    - scripts/validate_mvp.ps1
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - runs/**
    - release_packages/**
    - production_candidate/**
    - failure_samples/**
    - .env
    - .env.local
    - package.json
    - package-lock.json
  allowed_actions:
    - inspect local Git worktree state
    - group existing uncommitted v14.165-v14.208 local files by product capability track
    - record exact-file staging boundaries for a future human-reviewed commit
    - run local validators
  forbidden_actions:
    - git add .
    - staging files
    - commit
    - push
    - tag
    - release
    - deploy
    - dependency install or dependency change
    - provider/API/plugin/MCP call
    - image generation
    - .env or .env.local read
    - real manifest/VCPChat/VCPToolBox read
    - DailyNote or VCP memory write
    - production_candidate write
    - failure_samples write
  validation:
    required:
      - node --check scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js
      - node scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    forbidden:
      - provider/API/plugin/MCP calls
      - image generation
      - dependency install
      - real VCP runtime actions
  commit:
    allowed: false
    message: null
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

## Phase Difference

v14.209 does not add another product feature gate. It freezes the current dirty
worktree into a local recovery and staging audit so the project can continue
without losing track of which uncommitted files belong together.

The audit covers the existing v14.165-v14.208 local chain:

```yaml
observed_scope:
  tracked_modified_files: 24
  untracked_v14_165_to_v14_208_files: 133
  untracked_phase_docs: 44
  untracked_phase_validators: 44
  untracked_schema_examples: 45
  staged_files_now: 0
  branch_ahead_origin_master: 19
  branch_behind_origin_master: 0
```

## Exact File Groups

```yaml
change_groups:
  - group_id: recoverability_three_sample_baseline
    phase_range: v14.165-v14.168
    purpose: accepted sample metadata, third candidate readiness, blocker preflight, and dashboard evidence alignment
    phase_docs: 4
    validators: 4
    schema_examples: 6
    commit_readiness: requires_exact_file_review

  - group_id: review_console_local_productization
    phase_range: v14.169-v14.189
    purpose: static Review Console lifecycle, prompt completion, detail drawer, compare, filter, sort, notes, and third sample readiness surfaces
    phase_docs: 21
    validators: 21
    schema_examples: 21
    commit_readiness: requires_exact_file_review

  - group_id: authorization_control_layer
    phase_range: v14.190-v14.203
    purpose: accepted_samples authorization package, package compiler, manifest/archive/production/memory preflight, blocker arbiter, and Review Console handoff state
    phase_docs: 14
    validators: 14
    schema_examples: 14
    commit_readiness: requires_exact_file_review

  - group_id: runtime_gap_and_browser_blocker
    phase_range: v14.204-v14.208
    purpose: local runtime-gap dashboard contract, static UI panel, draft snapshot, trace matrix, and browser-review blocker handoff
    phase_docs: 5
    validators: 5
    schema_examples: 4
    commit_readiness: requires_exact_file_review
```

## Commit And Rollback Meaning

This audit does not authorize commit or push. It only defines the reviewable
groups that a future exact-file staging pass must use.

```yaml
commit_readiness:
  git_add_dot_allowed: false
  staged_files_now: 0
  commit_performed_now: false
  push_performed_now: false
  safe_future_staging_rule: stage only reviewed files from one coherent group or an explicitly approved combined group
  rollback_model: unstaged files can still be reviewed, staged selectively, or reverted by exact path if Jenn requests it
```

## Boundary Confirmation

```yaml
boundary:
  worktree_audit_only: true
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  mcp_runtime_performed: false
  image_generation_performed: false
  env_or_secret_read_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
  accepted_samples_write_performed_by_this_phase: false
  failure_samples_write_performed: false
  production_candidate_write_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  dependency_change_performed: false
  package_json_modified_by_this_phase: false
  staged_files_created: false
  commit_performed: false
  push_tag_release_deploy_performed: false
  artifact_recoverability_is_not_vcp_runtime_integration: true
  vcp_runtime_integration_proven: false
```

## Closeout Criteria

v14.209 passes only if the validator proves:

- the v14.165-v14.208 local chain is grouped by exact local file surfaces
- no files are staged
- `git add .` was not used
- the branch is ahead of origin but not behind
- package/dependency/runtime/provider/image/memory/push actions remain false
- the audit cannot be misread as VCP runtime integration or production readiness
