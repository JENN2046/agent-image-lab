# v7.189 Worker Scope Escalation Guard Gate

## Executive Verdict

This gate defines a docs-only A4 worker boundary for `v7.189_worker_scope_escalation_guard_gate`.

Verdict: PASS only if the worker stays inside the single-file allowlist, performs no validator or runtime action, and stops immediately on any scope escalation trigger.

The worker is not authorized to repair unrelated state, expand scope, decide the next phase, stage, commit, push, tag, run validators, run scripts, access runtime systems, call providers, generate images, read real VCPChat or VCPToolBox, read real manifests, write memory, or handle secrets beyond sanitized blocker reporting.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.189_worker_scope_escalation_guard_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/v7_189_worker_scope_escalation_guard_gate.md
  forbidden_files:
    - "*"
  allowed_actions:
    - create_or_modify_single_allowlisted_doc
    - run_git_status_short
    - run_git_diff_for_allowlisted_doc
    - run_git_diff_check
    - output_worker_closeout_yaml
  forbidden_actions:
    - modify_non_allowlisted_files
    - repair_dirty_tree
    - stage
    - commit
    - push
    - tag
    - decide_next_phase
    - run_validator
    - run_script
    - run_powershell_script
    - run_node_or_npm
    - access_runtime
    - call_plugin
    - contact_provider
    - generate_image
    - read_vcpchat
    - read_vcptoolbox
    - read_real_manifest
    - call_dailynote
    - write_vcp_memory
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_189_worker_scope_escalation_guard_gate.md
      - git diff --check
    forbidden:
      - validators
      - scripts
      - powershell_scripts
      - node
      - npm
      - runtime
      - plugin
      - provider
      - image_generation
      - memory_write
      - dailynote
      - vcpchat
      - vcptoolbox
      - cdp
      - bridge
      - mcp
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
  phase: v7.189_worker_scope_escalation_guard_gate
  purpose: define worker stop rules for scope escalation during disjoint docs-only work
  allowed_write_set:
    - docs/v7_189_worker_scope_escalation_guard_gate.md
  command_allowlist:
    - git status --short
    - git diff -- docs/v7_189_worker_scope_escalation_guard_gate.md
    - git diff --check
  worker_must_stop_on:
    - non_allowlisted_file_required_or_detected
    - dirty_tree_detected
    - validator_or_script_needed
    - runtime_plugin_provider_image_or_memory_needed
    - push_needed
    - vcpchat_vcptoolbox_or_real_manifest_read_needed
    - suspected_secret_detected
  worker_must_not:
    - self_repair
    - expand_scope
    - decide_next_phase
    - stage
    - commit
    - push
    - tag
```

## Scope Escalation Triggers

A worker must stop and output a blocker to the commander if any trigger below occurs.

| Trigger | Worker response |
| --- | --- |
| A required read or write touches a non-allowlisted file | Stop; report the exact non-allowlisted path or sanitized path class. |
| `git status --short` shows dirty tree state before work | Stop; report dirty tree detected. Do not inspect or repair unrelated changes. |
| A validator, script, or PowerShell script is needed | Stop; report validator/script requirement. Do not run it. |
| Node, npm, runtime, plugin, provider, image generation, DailyNote, or memory is needed | Stop; report the required capability. Do not access it. |
| Push, tag push, remote write, release, or deployment is needed | Stop; report remote action required. Do not perform it. |
| Reading VCPChat, VCPToolBox, or a real manifest is needed | Stop; report external/source-read authorization required. Do not read it. |
| A suspected secret is found | Stop; report only a sanitized blocker. Do not print secret values. |

## Blocker Output Contract

```yaml
worker_blocker:
  phase: v7.189_worker_scope_escalation_guard_gate
  status: BLOCKED
  blocker_type: <dirty_tree | non_allowlisted_file | validator_needed | script_needed | runtime_needed | plugin_needed | provider_needed | image_needed | memory_needed | push_needed | external_source_read_needed | suspected_secret | other>
  sanitized_detail: <no secret values, no raw sensitive payloads>
  allowed_file:
    - docs/v7_189_worker_scope_escalation_guard_gate.md
  files_modified_before_block: []
  commands_executed_before_block: []
  commander_action_required: true
```

Rules:

- `sanitized_detail` must not include tokens, keys, passwords, private chat content, raw manifests, or customer data.
- `files_modified_before_block` must include only files already modified by this worker.
- If the blocker occurs before modification, `files_modified_before_block` must be empty.
- The worker must not propose or select the next phase as a decision; it may only state the minimum approval or review needed.

## Worker Stop Procedure

1. Stop the current task immediately.
2. Do not run additional discovery beyond the already allowed command set.
3. Do not edit, repair, format, stage, commit, tag, push, or invoke any external capability.
4. Preserve the repository state as found.
5. Output `worker_blocker` YAML to the commander.
6. Include sanitized status only.

## Commander Review Procedure

The commander reviews worker output and diff after the worker stops or closes out.

Commander review should confirm:

- Only the allowlisted file changed.
- No stage, commit, push, tag, validator, script, PowerShell script, runtime, plugin, provider, image generation, DailyNote, VCP memory write, VCPChat read, VCPToolBox read, or real manifest read occurred.
- `git diff --check` passed or the worker reported a blocker before it could run.
- Any blocker is sanitized and does not leak secrets or sensitive source material.
- The worker did not decide the next phase.

## Boundary Matrix

| Boundary | Authorized for worker | Required worker behavior |
| --- | --- | --- |
| Modify `docs/v7_189_worker_scope_escalation_guard_gate.md` | Yes | Keep changes limited to this file. |
| Modify any other file | No | Stop and report blocker. |
| Dirty tree detected | No | Stop and report blocker. |
| Self-repair dirty tree | No | Stop; commander owns review. |
| Run `git status --short` | Yes | Use only for boundary check. |
| Run `git diff -- docs/v7_189_worker_scope_escalation_guard_gate.md` | Yes | Use only for targeted diff review. |
| Run `git diff --check` | Yes | Use only for whitespace validation. |
| Run validators or scripts | No | Stop and report blocker if needed. |
| Run PowerShell scripts | No | Stop and report blocker if needed. |
| Run node or npm | No | Stop and report blocker if needed. |
| Stage, commit, push, or tag | No | Never perform. |
| Runtime, plugin, provider, image, DailyNote, or memory access | No | Stop and report blocker if needed. |
| VCPChat, VCPToolBox, or real manifest read | No | Stop and report blocker if needed. |
| Suspected secret | No raw handling | Stop and report sanitized blocker only. |
| Decide next phase | No | Leave next-phase decision to commander. |

## Explicit Non-Authorization Statement

This gate does not authorize:

- real VCPChat read
- real VCPToolBox read
- real manifest read
- runtime execution
- plugin call
- provider contact
- image generation
- DailyNote call or write
- VCP memory write
- validator execution
- script execution
- PowerShell script execution
- Node or npm execution
- staging
- commit
- tag
- push
- release
- deployment
- external repository modification
- next-phase decision by the worker

## Pass Conditions

This gate passes only when all conditions are true:

- The worker created or modified only `docs/v7_189_worker_scope_escalation_guard_gate.md`.
- The worker ran only the allowed command set.
- `git diff --check` passed.
- No validator, script, PowerShell script, node, npm, runtime, plugin, provider, image generation, DailyNote, VCP memory write, VCPChat read, VCPToolBox read, real manifest read, stage, commit, tag, push, or remote action occurred.
- The worker did not decide the next phase.
- The worker closeout is present and truthful.

## Block Conditions

This gate is blocked if any condition is true:

- Dirty tree is detected before worker edits.
- Any non-allowlisted file must be read or modified to complete the task.
- Any validator, script, PowerShell script, node, npm, runtime, plugin, provider, image generation, DailyNote, memory write, VCPChat read, VCPToolBox read, real manifest read, push, tag, release, deployment, or remote action is required.
- A suspected secret appears.
- The worker cannot prove the diff is limited to the allowlisted file.
- `git diff --check` fails and the fix would require anything outside the allowed file or allowed commands.

## Closeout Template

```yaml
worker_closeout:
  phase: v7.189_worker_scope_escalation_guard_gate
  status: COMPLETED_VALIDATED | BLOCKED | FAILED
  changed_files:
    - docs/v7_189_worker_scope_escalation_guard_gate.md
  local_scope_result: <only_allowlisted_file_changed | blocked_before_change | failed>
  git_diff_check: <passed | failed | not_run>
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
  stage_performed: false
  next_phase_decided: false
  modified_file_path: docs/v7_189_worker_scope_escalation_guard_gate.md
```
