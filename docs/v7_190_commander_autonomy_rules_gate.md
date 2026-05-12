# v7.190 Commander Autonomy Rules Gate

## Executive Verdict

```yaml
verdict:
  phase: v7.190_commander_autonomy_rules_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_draft
  risk_level: R1
  result: docs_only_gate_defined
  summary: >
    Defines when a commander may autonomously continue a v7.x A4 docs-only
    single-file gate by deciding the next phase, preparing a phase_delta,
    spawning one bounded worker, reviewing the worker closeout and diff, running
    allowed Git-only checks, and staging/committing only the allowlisted file.
  production_authority: false
```

This gate does not authorize A5, production execution, runtime access, image
generation, plugin or provider contact, VCP memory writes, DailyNote writes,
real VCPChat or VCPToolBox reads, real manifest reads, dependency changes,
validator execution, script execution, push, tag, or release.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.190_commander_autonomy_rules_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/v7_190_commander_autonomy_rules_gate.md
  forbidden_files:
    - "*"
  allowed_actions:
    - create_or_update_single_allowlisted_docs_file
    - run_git_status_short
    - run_git_diff_for_allowlisted_file
    - run_git_diff_check
  forbidden_actions:
    - push
    - tag
    - release
    - A5
    - runtime_access
    - plugin_call
    - provider_contact
    - image_generation
    - DailyNote_write
    - VCP_memory_write
    - real_VCPChat_read
    - real_VCPToolBox_read
    - real_manifest_read
    - validator_execution
    - script_execution
    - PowerShell_script_execution
    - node_or_npm_execution
    - dependency_change
    - config_change
    - multi_file_write
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_190_commander_autonomy_rules_gate.md
      - git diff --check
    forbidden:
      - validator_script
      - PowerShell_script
      - node
      - npm
      - runtime
      - plugin
      - provider
      - image_generation
      - memory_write
      - DailyNote
      - VCPChat
      - VCPToolBox
      - CDP
      - bridge
      - MCP
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
  phase: v7.190_commander_autonomy_rules_gate
  purpose: define_commander_autonomy_rules_for_v7_docs_only_single_file_gates
  applies_to:
    - v7.x
    - A4
    - docs_only
    - single_file_gate
  autonomy_model:
    commander_may_decide_next_phase: true
    commander_may_generate_phase_delta: true
    commander_may_spawn_single_worker: true
    commander_may_review_worker_closeout: true
    commander_may_run_allowed_git_checks: true
    commander_may_stage_allowlisted_file: true
    commander_may_commit_allowlisted_file: true
    worker_may_stage: false
    worker_may_commit: false
    worker_may_push: false
    worker_may_decide_next_phase: false
  narrowing_rules:
    - commander autonomy is limited to clean, passed, v7.x A4 docs-only single-file gates
    - any multi-file change exits this autonomy model
    - any validator or script need exits this autonomy model
    - any A5 need exits this autonomy model
```

## Autonomy Preconditions

Commander autonomy is allowed only when all preconditions are true:

- `git status --short` is clean before the next gate begins.
- The immediately previous phase closeout is passed and available for review.
- The next task is a `v7.x` `A4` docs-only single-file gate.
- The next task has an exact allowlisted file path.
- The task can be completed without validators, scripts, runtime, providers,
  plugins, generated images, VCP memory, DailyNote, VCPChat, VCPToolBox, or real
  manifest access.
- The commander can produce a narrow phase_delta that does not weaken
  `AGENTS.md`.
- The worker write set is disjoint and limited to one allowlisted file.
- The commander can review the worker closeout and diff before staging or
  committing.

If any precondition is false, commander autonomy stops before worker spawn or
before local Git staging.

## Commander Allowed Autonomous Actions

When all autonomy preconditions pass, the commander may autonomously:

- Decide the next eligible `v7.x` A4 docs-only single-file phase.
- Generate the phase_delta for that phase.
- Spawn exactly one worker with a strict disjoint single-file write set.
- Require the worker to output a structured closeout.
- Review the worker closeout against the phase_delta and `AGENTS.md`.
- Run only the allowed Git checks for that phase.
- Stage only the single allowlisted file after review passes.
- Create one local commit containing only the allowlisted file, when the phase
  explicitly permits commander staging and commit.
- Output a commander-reviewed closeout that names the file, validation status,
  boundaries kept, and next recommended step.

## Commander Forbidden Actions

The commander must not autonomously:

- Push, tag, release, deploy, or publish.
- Enter A5 or infer A5 from continuation language.
- Use runtime, plugin, provider, image generation, DailyNote, VCP memory,
  VCPChat, VCPToolBox, real manifest, CDP, bridge, or MCP access.
- Run validators, scripts, PowerShell scripts, Node, npm, dependency installs,
  or build commands unless a later gate explicitly authorizes them.
- Modify dependency manifests, lockfiles, config files, secret files, or `.env`
  files.
- Stage or commit any file outside the allowlist.
- Continue after detecting multi-file drift, user-owned changes, secret risk,
  A5 need, or unclear authority.

## Worker Boundaries

Workers under this gate are implementation-only and bounded:

- Worker writes are limited to the exact file named by the commander.
- Worker must not stage, commit, push, tag, or release.
- Worker must not decide the next phase.
- Worker must not run validators, scripts, PowerShell scripts, Node, npm,
  runtime, plugins, providers, image generation, memory, DailyNote, VCPChat,
  VCPToolBox, CDP, bridge, or MCP.
- Worker must report whether any boundary was touched.
- Worker must output `worker_closeout` YAML for commander review.

## Autonomy Stop Conditions

Commander autonomy stops immediately when any condition appears:

- `git status --short` is not clean before phase start.
- Previous closeout is missing, failed, ambiguous, or not reviewed.
- The next task is not a `v7.x` A4 docs-only single-file gate.
- More than one file needs to be created, modified, staged, or committed.
- The task needs a validator, script, runtime, provider, plugin, image
  generation, memory write, DailyNote write, VCPChat read, VCPToolBox read, or
  real manifest read.
- A dependency, lockfile, config, secret, or environment file change is needed.
- Worker closeout is missing, inconsistent, or reports forbidden access.
- Diff includes unauthorized files or loosens project safety boundaries.
- Push, tag, release, A5, or external action becomes the next useful step.

## Commander Review Requirements

Before any commander local stage or commit, the commander must review:

- Worker closeout YAML.
- `git status --short`.
- `git diff -- <allowlisted-file>`.
- `git diff --check`.
- That only the allowlisted file changed.
- That no forbidden capability was used.
- That no runtime, plugin, provider, image, memory, DailyNote, VCPChat,
  VCPToolBox, manifest, dependency, config, or secret boundary was crossed.
- That the final closeout states local-only scope and no remote action.

## Boundary Matrix

| Boundary | Commander | Worker |
| --- | --- | --- |
| Decide next eligible docs-only phase | Allowed if preconditions pass | Forbidden |
| Generate phase_delta | Allowed if preconditions pass | Forbidden unless assigned as file content |
| Spawn worker | Allowed: exactly one worker | Forbidden |
| Modify allowlisted docs file | Allowed | Allowed |
| Modify any other file | Forbidden | Forbidden |
| Run `git status --short` | Allowed | Allowed only if assigned |
| Run `git diff -- <allowlisted-file>` | Allowed | Allowed only if assigned |
| Run `git diff --check` | Allowed | Allowed only if assigned |
| Run validators or scripts | Forbidden | Forbidden |
| Stage allowlisted file | Allowed only after review if phase permits | Forbidden |
| Commit allowlisted file | Allowed only after review if phase permits | Forbidden |
| Push, tag, release | Forbidden | Forbidden |
| A5 / runtime / plugin / provider / image / memory | Forbidden | Forbidden |
| VCPChat / VCPToolBox / real manifest read | Forbidden | Forbidden |
| Dependency or config change | Forbidden | Forbidden |

## Explicit Non-Authorization Statement

This gate explicitly does not authorize:

```text
push
tag
release
A5
runtime
plugin call
provider contact
image generation
DailyNote write
VCP memory write
real VCPChat read
real VCPToolBox read
real manifest read
validator execution
script execution
PowerShell script execution
node/npm execution
dependency change
config change
multi-file write
external repository modification
```

## Pass Conditions

This gate passes only when:

- The autonomy rules are documented in the allowlisted file.
- The document uses the fixed A4 docs-only gate model plus phase_delta.
- Commander allowed actions and forbidden actions are explicit.
- Worker boundaries are explicit.
- Stop conditions, review requirements, boundary matrix, non-authorization,
  pass conditions, block conditions, and closeout template are present.
- `git diff --check` passes.
- No forbidden command or capability was used.

## Block Conditions

This gate is blocked when:

- Any file outside `docs/v7_190_commander_autonomy_rules_gate.md` must change.
- A validator, script, runtime, plugin, provider, image, memory, DailyNote,
  VCPChat, VCPToolBox, real manifest, CDP, bridge, or MCP action is needed.
- A dependency, lockfile, config, secret, or environment change is needed.
- The diff weakens A5, no-execution, no-external-read, worker, push, tag, or
  release boundaries.
- The repository state shows unrelated or user-owned changes that make the
  single-file review unsafe.

## Closeout Template

```yaml
commander_reviewed_closeout:
  phase: <phase_id>
  base_contract: AGENTS.md
  mode: A4
  intent: local_draft
  changed_files:
    - <allowlisted_file>
  worker_closeout_reviewed: true
  git_status_short: <clean|dirty_with_only_allowlisted_file|blocked>
  git_diff_reviewed: true
  git_diff_check: <passed|failed|not_run>
  validator_executed: false
  script_executed: false
  powershell_script_executed: false
  runtime_accessed: false
  plugin_called: false
  provider_contacted: false
  image_generated: false
  daily_note_written: false
  vcp_memory_written: false
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  real_manifest_read: false
  dependency_changed: false
  config_changed: false
  stage_performed: <true|false>
  commit_performed: <true|false>
  push_performed: false
  tag_performed: false
  next_phase_decided: <true|false>
  boundary_result: <passed|blocked>
  next_recommended_step: <single_next_step>
```
