# v7.187 Commander Worker Protocol Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  commander_worker_protocol: completed
  commander_role_defined: true
  worker_role_defined: true
  worker_file_mutation_allowed_now: false
  worker_trial_started_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.188_commander_worker_docs_only_trial_gate
```

This gate defines the commander/worker protocol for future docs-only gates. It
does not spawn a worker, does not assign file mutation to a worker, and does not
authorize runtime, plugin, provider, image, DailyNote, or VCP memory activity.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.187_commander_worker_protocol_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_187_commander_worker_protocol_gate.md
  forbidden_files:
    - AGENTS.md
    - README.md
    - package.json
    - scripts/**
    - .agent_board/**
    - review_console/**
    - integrations/**
    - schemas/**
    - fixtures/**
  allowed_actions:
    - create docs-only commander/worker protocol gate
    - define commander responsibilities
    - define worker responsibilities
    - define worker_task contract
    - define worker_closeout review contract
    - define disjoint write set rule
    - define no-runtime boundaries
    - run allowed Git checks
    - stage only allowlisted file
    - commit only allowlisted file
  forbidden_actions:
    - push
    - tag
    - validator execution
    - script execution
    - PowerShell script execution
    - runtime execution
    - worker file mutation in this phase
    - VCPChat access
    - VCPToolBox access
    - plugin call
    - provider contact
    - image generation
    - DailyNote write
    - VCP memory write
    - dependency change
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_187_commander_worker_protocol_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.187 commander worker protocol"
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

## Phase Delta

```yaml
phase_delta:
  phase: v7.187_commander_worker_protocol_gate
  purpose: >
    定义 commander/worker 协议：commander 负责任务设计、phase_delta、
    worker_task 分发、worker_closeout 审查与下一步判断；worker 只负责
    单个 allowlisted docs-only gate 的执行、允许 Git 检查、本地 commit
    与 closeout 输出；worker 不决定下一阶段、不 push、不运行
    validator/script/PowerShell、不接触 runtime/plugin/provider/image/memory。
  source_context:
    previous_gate: v7.186_static_review_console_mockup_alignment_gate
    next_trial_gate: v7.188_commander_worker_docs_only_trial_gate
  creates:
    - commander_worker_protocol
    - commander_responsibility_model
    - worker_responsibility_model
    - worker_task_contract
    - worker_closeout_contract
    - commander_review_contract
    - disjoint_write_set_rule
  does_not_create:
    - worker_trial_execution
    - sub_agent_file_mutation
    - runtime_adapter
    - plugin_execution_path
    - provider_contact_path
    - memory_write_path
```

## Commander Role

```yaml
commander_role:
  owner: main_thread
  responsibilities:
    - classify task intent and risk
    - choose fixed gate template
    - define phase_delta
    - define exact allowlisted file
    - define disjoint write set
    - define worker_task
    - distribute one bounded worker task when explicitly authorized
    - review worker_closeout
    - inspect resulting diff/status before final acceptance
    - decide whether next phase should start
    - produce final closeout for the user

  authority:
    can_define_next_phase: true
    can_accept_or_reject_worker_output: true
    can_request_revision: true
    can_stop_on_boundary_violation: true
    can_push: false
    can_authorize_runtime_without_A5: false
```

The commander is responsible for system judgment. Worker output is evidence, not
final authority, until the commander reviews it against repository reality.

## Worker Role

```yaml
worker_role:
  owner: spawned_worker
  scope: one_allowlisted_docs_only_gate
  responsibilities:
    - execute one assigned docs-only gate
    - modify only the assigned allowlisted file
    - run only allowed Git checks
    - stage only the assigned allowlisted file
    - create one local commit when authorized by the worker_task
    - output worker_closeout YAML
    - report any blocker immediately

  forbidden:
    - decide next phase
    - broaden phase_delta
    - edit files outside the disjoint write set
    - push
    - tag
    - run validator
    - run script
    - run PowerShell script
    - touch runtime
    - call plugin
    - contact provider
    - generate image
    - write DailyNote
    - write VCP memory
    - modify dependencies
```

A worker is a narrow executor. It does not own product direction, authorization
state, or next-step selection.

## Worker Task Contract

```yaml
worker_task_contract:
  required_fields:
    - phase
    - base_contract
    - mode
    - intent
    - risk_level
    - exact_allowed_file
    - disjoint_write_set
    - phase_delta
    - required_sections
    - allowed_git_checks
    - forbidden_actions
    - commit_message
    - closeout_required

  invariants:
    one_worker_one_gate: true
    one_worker_one_allowlisted_file: true
    disjoint_write_set_required: true
    docs_only_required_by_default: true
    next_phase_decision_reserved_for_commander: true
    worker_must_not_assume_remote_authorization: true
```

The worker task must be specific enough that the worker can execute without
making product-direction decisions.

## Worker Closeout Contract

```yaml
worker_closeout_contract:
  required_fields:
    - phase
    - commit_hash
    - commit_message
    - branch
    - git_status
    - changed_files
    - local_scope_result
    - validation
    - safety_boundaries
    - final_state

  must_report:
    - exact_changed_file
    - git_diff_check_result
    - whether validator_executed
    - whether script_executed
    - whether powershell_script_executed
    - whether runtime_accessed
    - whether plugin_called
    - whether provider_contacted
    - whether image_generated
    - whether memory_written
    - whether push_performed

  must_not_claim:
    - full_project_validation_if_not_run
    - remote_sync_if_not_checked
    - production_readiness
    - next_phase_started
```

Closeout must separate validated facts from non-executed boundaries.

## Commander Review Contract

```yaml
commander_review_contract:
  after_worker_finishes:
    - inspect worker_closeout
    - verify git status
    - verify changed files match disjoint write set
    - verify commit message
    - verify no forbidden action was reported
    - verify no unexpected files changed
    - decide accept_or_reject

  acceptance_requires:
    - worker scope matched task
    - only allowlisted file changed
    - git_diff_check_passed
    - local commit completed when requested
    - no runtime/plugin/provider/image/memory boundary crossed
    - no push performed

  rejection_requires_stop_when:
    - worker changed unexpected file
    - worker ran forbidden command
    - worker broadened scope
    - worker opened runtime path
    - worker attempted remote action
```

The commander does not blindly trust worker summaries. The commander verifies the
repository state before reporting completion.

## Disjoint Write Set Rule

```yaml
disjoint_write_set_rule:
  required: true
  definition: >
    Each worker must receive exactly one write set that does not overlap with
    any other worker or commander write set active in the same phase.
  docs_only_default:
    allowed_file_count: 1
    allowed_file_pattern: "docs/<phase_id>.md"
  overlap_policy:
    overlapping_workers_forbidden: true
    commander_may_review_but_not_edit_same_file_during_worker_run: true
    integration_edits_reserved_for_commander_after_worker_completion: true
```

For v7.188 trial use, the worker must receive one unique documentation file as
the full write set.

## Commander Worker Sequence

```yaml
commander_worker_sequence:
  protocol_definition_phase:
    phase: v7.187_commander_worker_protocol_gate
    worker_spawned: false
    worker_file_mutation_allowed: false

  first_trial_phase:
    phase: v7.188_commander_worker_docs_only_trial_gate
    commander_spawns_worker: true
    worker_task_count: 1
    worker_write_set_count: 1
    commander_reviews_after_worker: true

  later_parallel_phase:
    allowed_only_after_successful_trial: true
    requires_disjoint_write_sets: true
    requires_explicit_task_split: true
    still_docs_only_by_default: true
```

v7.187 is protocol only. The first sub-agent trial is deferred to v7.188.

## Worker Boundary Matrix

```yaml
worker_boundary_matrix:
  docs_only_gate_execution:
    worker_allowed_when_assigned: true
    commander_review_required: true

  allowed_git_checks:
    worker_allowed_when_assigned: true
    commands:
      - git status --short
      - git diff -- <allowlisted_file>
      - git diff --check

  local_commit:
    worker_allowed_when_assigned: true
    requires_exact_commit_message: true

  next_phase_decision:
    worker_allowed: false
    commander_only: true

  push:
    worker_allowed: false
    commander_allowed_without_explicit_remote_authorization: false

  validator_script_powershell:
    worker_allowed: false

  runtime_plugin_provider_image_memory:
    worker_allowed: false
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_187:
  worker_trial_started: false
  worker_file_mutation: false
  static_prototype_file_creation: false
  renderer_code_creation: false
  preload_code_creation: false
  IPC_handler_creation: false
  runtime_adapter_creation: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  plugin_call: false
  provider_contact: false
  image_generation: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  submitDraft: false
  push_tag_release: false
```

v7.187 defines how commander and worker cooperate. It does not start the worker
trial.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_187_commander_worker_protocol_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - commander_role_defined
  - worker_role_defined
  - worker_task_contract_defined
  - worker_closeout_contract_defined
  - commander_review_contract_defined
  - disjoint_write_set_rule_defined
  - worker_boundary_matrix_defined
  - explicit_non_authorization_statement_defined
  - git_diff_check_passed
  - no worker spawned for file mutation in this phase
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - worker_file_mutation_started_in_v7_187
  - validator_or_script_executed
  - PowerShell_script_executed
  - runtime_access_attempted
  - VCPChat_access_attempted
  - VCPToolBox_access_attempted
  - plugin_call_authorized
  - provider_contact_authorized
  - image_generation_authorized
  - memory_write_authorized
  - external_side_effect_occurred
  - push_attempted
```

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.188_commander_worker_docs_only_trial_gate
  purpose: >
    主线程作为 commander spawn 一个 worker，只分配单个 docs-only gate，
    明确 disjoint write set 为唯一 allowlisted file；worker 完成后主线程
    审查 closeout 和 diff，再决定是否继续。

alternative_next:
  phase: v7.188_commander_worker_protocol_review_gate
  purpose: >
    先由主线程只读复核 v7.187 protocol，再决定是否进入 worker trial。
```

## Closeout Template

```yaml
closeout:
  phase: v7.187_commander_worker_protocol_gate
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.187 commander worker protocol"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  commander_worker_protocol:
    fixed_gate_template_used: true
    phase_delta_defined: true
    commander_role_defined: true
    worker_role_defined: true
    worker_task_contract_defined: true
    worker_closeout_contract_defined: true
    commander_review_contract_defined: true
    disjoint_write_set_rule_defined: true
    worker_boundary_matrix_defined: true
    worker_trial_started_now: false

  authorization:
    worker_file_mutation_allowed_now: false
    next_phase_decision_worker_allowed_now: false
    push_allowed_now: false
    validator_allowed_now: false
    script_allowed_now: false
    powershell_script_allowed_now: false
    image_generation_allowed_now: false
    plugin_call_allowed_now: false
    provider_contact_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    submitDraft_allowed_now: false

  validation:
    git_diff_check: passed | failed
    validator_executed: false
    script_executed: false
    powershell_script_executed: false
    node_check_required: false

  safety_boundaries:
    worker_spawned_for_file_mutation: false
    runtime_accessed: false
    VCPChat_accessed: false
    VCPToolBox_accessed: false
    CDP_accessed: false
    bridge_methods_called: false
    plugin_called: false
    provider_contacted: false
    image_generated: false
    daily_note_written: false
    vcp_memory_written: false
    submitDraft_called: false
    dependency_added: false
    package_json_modified: false
    ci_or_hook_created: false

remote_sync_verification:
  push_performed: false
  remote_head_checked: false
  pending_push: true | false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
