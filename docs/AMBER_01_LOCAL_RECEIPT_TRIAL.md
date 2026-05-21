# Amber-01 Local Receipt Trial

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
task_id: amber_01_local_receipt_trial
lane: Amber
trial_type: local-only receipt trial
status: completed_validated

## Purpose

Amber-01 proves the local v3 chain before any real external Amber action:

```text
envelope -> bounded action -> receipt -> validation -> continuation judge
```

This trial does not call providers, plugins, APIs, image generation, DailyNote,
or VCP memory. It does not read a real manifest, VCPChat, or VCPToolBox source.
It does not change dependencies, run runtime probes, read secrets, push, tag,
release, deploy, or perform destructive actions.

## Envelope

```yaml
envelope_id: envelope-amber-01-local-receipt-trial
task_id: amber_01_local_receipt_trial
lane: Amber
target_systems:
  - local_repository_only
max_provider_calls: 0
max_plugin_calls: 0
max_api_calls: 0
max_image_candidates: 0
max_external_read_files: 0
max_write_files: 4
max_dependency_actions: 0
max_runtime_probe_minutes: 0
retry_count: 0
overwrite_existing_files_allowed: false
secret_value_read_allowed: false
raw_private_data_print_allowed: false
push_allowed: false
tag_release_deploy_allowed: false
destructive_action_allowed: false
```

## Actual Action

```yaml
action_performed: local_repository_truth_snapshot_and_receipt_record
target_systems:
  - local_repository_only
files_read:
  - AGENTS.md
  - AGENTS.autopilot-overlay.md
  - .agent_board/HANDOFF.md
  - .agent_board/RUN_STATE.md
  - .agent_board/TASK_QUEUE.md
  - .agent_board/CHECKPOINT.md
  - README.md
  - docs/00_project_roadmap.md
files_written:
  - docs/AMBER_01_LOCAL_RECEIPT_TRIAL.md
  - tests/schema_examples/autopilot_execution_receipt.amber_01_local_trial.example.json
  - .agent_board/AUTOPILOT_LEDGER.md
  - scripts/validate_autopilot_governance_kernel.js
```

The write set is limited to four files to stay inside the Amber-01 envelope.
README, roadmap, and the existing resume surfaces remain readable truth inputs
for this trial; the new ledger is the appendable status surface for Amber
receipts.

## Red Gates

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
destructive_action_performed: false
```

No Red Lane condition was triggered.

## Validation

Required validation:

```text
git status --short --branch
node --check scripts\validate_autopilot_governance_kernel.js
node scripts\validate_autopilot_governance_kernel.js
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

The receipt records this validation set after the validator proves the local-only
Amber receipt.

## Continuation Judge

```yaml
current_goal_clear: true
inside_envelope_budget: true
red_condition_seen: false
receipt_recorded: true
validation_path_clear: true
next_auto_step_allowed: true
stop_reason: none
```

The next automatic step may continue only inside a clear Green task or another
budgeted Amber envelope with a receipt. Push, tag, release, deploy, secret value
access, destructive actions, uncapped cost, unbounded loops, and broad external
repository modification remain Red.
