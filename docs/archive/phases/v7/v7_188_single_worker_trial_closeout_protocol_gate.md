# v7.188 Single Worker Trial Closeout Protocol Gate

```yaml
gate_template:
  phase: v7.188_single_worker_trial_closeout_protocol_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/v7_188_single_worker_trial_closeout_protocol_gate.md
  forbidden_files:
    - "*"
  allowed_actions:
    - create_or_update_this_docs_gate_only
    - inspect_git_status_short
    - inspect_diff_for_this_gate_file
    - run_git_diff_check
  forbidden_actions:
    - git_add
    - git_commit
    - git_push
    - git_tag
    - validator_execution
    - script_execution
    - powershell_script_execution
    - node_or_npm_execution
    - runtime_access
    - plugin_call
    - provider_contact
    - image_generation
    - DailyNote_write
    - VCP_memory_write
    - VCPChat_access
    - VCPToolBox_access
    - CDP_access
    - bridge_access
    - MCP_access
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_188_single_worker_trial_closeout_protocol_gate.md
      - git diff --check
    forbidden:
      - validator_or_project_script
      - PowerShell_script
      - node
      - npm
      - runtime_probe
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

## Phase Delta

```yaml
phase_delta:
  purpose: >
    Record a docs-only A4 gate for a single worker trial closeout protocol.
    The gate checks that the v7.187 commander/worker protocol remains bounded
    by explicit worker tasks, isolated worker closeouts, disjoint write sets,
    a visible boundary matrix, and commander-owned review flow.
  scope:
    write_set:
      - docs/v7_188_single_worker_trial_closeout_protocol_gate.md
    read_assumption:
      - no runtime, provider, plugin, image, memory, VCPChat, or VCPToolBox read is needed
    authority:
      - worker may draft this local gate only
      - commander reviews closeout and diff after worker completion
      - worker does not decide the next phase
  pass_conditions:
    - worker_task contract is explicitly checked
    - worker_closeout contract is explicitly checked
    - disjoint_write_set rule is explicitly checked
    - boundary_matrix is explicitly checked
    - commander review flow is explicitly checked
    - no validator, script, PowerShell script, node, or npm command is executed
    - no runtime, plugin, provider, image, memory, DailyNote, VCPChat, or VCPToolBox access occurs
    - no git add, commit, push, or tag occurs
  block_conditions:
    - any required check needs runtime, provider, plugin, image, memory, DailyNote, VCPChat, or VCPToolBox access
    - any required check needs a validator, project script, PowerShell script, node, or npm command
    - any write outside the allowed file becomes necessary
    - any stage decision beyond this closeout gate is requested from the worker
```

## Protocol Checks

### worker_task Contract

The v7.187 worker task contract is treated as task-local authority only. A
worker receives one named phase, one explicit write boundary, one allowed command
set, and one closeout format. The worker may not infer broader repository
ownership, phase control, remote authority, runtime authority, generation
authority, or validation authority from participation in the trial.

For this gate, the worker task contract requires:

- `phase` is fixed to `v7.188_single_worker_trial_closeout_protocol_gate`.
- writes are limited to `docs/v7_188_single_worker_trial_closeout_protocol_gate.md`.
- validation is limited to the allowed Git inspection commands.
- validator, script, PowerShell script, node, and npm execution remain forbidden.
- runtime, plugin, provider, image, memory, DailyNote, VCPChat, VCPToolBox, CDP,
  bridge, and MCP access remain forbidden.

### worker_closeout Contract

The worker closeout is an evidence package for commander review, not a release
decision. It must report the phase, changed files, local scope result, validation
status, forbidden-action booleans, and the modified file path.

The closeout must state:

- `validator_executed=false`
- `script_executed=false`
- `powershell_script_executed=false`
- `runtime_accessed=false`
- `plugin_called=false`
- `provider_contacted=false`
- `image_generated=false`
- `vcp_memory_written=false`
- `push_performed=false`
- `commit_performed=false`
- `next_phase_decided=false`

### disjoint_write_set Rule

The disjoint write set rule prevents parallel workers from overwriting each
other. This worker owns only one file for this phase:

```text
docs/v7_188_single_worker_trial_closeout_protocol_gate.md
```

All other repository files are outside this worker's write set. If completing
the gate would require editing another file, the worker must stop and report the
blocker instead of broadening scope.

### boundary_matrix

```yaml
boundary_matrix:
  docs_gate_file:
    allowed: true
    path: docs/v7_188_single_worker_trial_closeout_protocol_gate.md
    notes: only writable file for this worker
  repository_other_files:
    allowed: false
    notes: commander or other workers may own these; do not modify
  git_stage_commit_push_tag:
    allowed: false
    notes: no git add, commit, push, or tag in this worker gate
  validators_and_scripts:
    allowed: false
    notes: no validator, project script, PowerShell script, node, or npm
  runtime_plugin_provider:
    allowed: false
    notes: no runtime access, plugin call, provider contact, or API call
  image_memory_dailynote:
    allowed: false
    notes: no image generation, VCP memory write, or DailyNote write
  external_systems:
    allowed: false
    notes: no VCPChat, VCPToolBox, CDP, bridge, or MCP access
  phase_control:
    allowed: false
    notes: worker reports closeout; commander decides next phase
```

### Commander Review Flow

The commander remains the integration owner. After the worker finishes, the
commander reviews this document, the diff for this exact file, the closeout YAML,
and any reported validation result. The commander decides whether the trial
passed, whether additional local gates are needed, and whether any future phase
should be proposed.

The worker does not:

- decide the next phase
- stage, commit, push, or tag
- run validators or scripts
- contact runtime, plugins, providers, APIs, DailyNote, memory, VCPChat, or
  VCPToolBox
- create images
- modify any file outside this gate document

## Closeout Template

```yaml
worker_closeout:
  phase: v7.188_single_worker_trial_closeout_protocol_gate
  changed_files:
    - docs/v7_188_single_worker_trial_closeout_protocol_gate.md
  local_scope_result: null
  git_diff_check: null
  validator_executed: false
  script_executed: false
  powershell_script_executed: false
  runtime_accessed: false
  plugin_called: false
  provider_contacted: false
  image_generated: false
  vcp_memory_written: false
  push_performed: false
  commit_performed: false
  next_phase_decided: false
  modified_file_path: docs/v7_188_single_worker_trial_closeout_protocol_gate.md
```
