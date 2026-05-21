# Autopilot Amber Action Packet Preflight

Phase: `amber_action_packet_preflight_v1`

This Green Lane hardening step improves safety before future real Amber
execution. It is local validation only and does not perform provider, plugin,
API, image, memory, runtime, source-read, dependency, secret, push, tag,
release, or deploy actions.

## Purpose

Future real Amber work must not jump directly from an envelope into action. It
must first pass a reusable action packet preflight that proves exact target,
budget, cost, rollback, validation, receipt, registry, and stop-condition
boundaries are present.

The preflight gate is not an executor. It validates local fixtures and rejects
packets that would create false readiness or blur Red Lane boundaries.

## Goal Decomposition Result

Mission:

```text
Improve Autopilot safety before real Amber execution.
```

Selected next safe task:

```text
add_amber_action_packet_preflight_validator
```

The selected task is Green Lane because it only adds local schema, fixture,
validator, docs, and status-surface updates. It directly addresses the highest
current risk: the Amber dry-run loop already embeds an action packet, but there
was no standalone preflight fixture and fail-closed validator for future real
Amber use.

## Candidate Gaps Found

1. `embedded_action_packet_no_standalone_preflight`
   - Evidence: `scripts/simulate_amber_dry_run_execution_loop.js`.
   - Risk: future Amber work could rely on an embedded packet shape without a
     reusable preflight gate.
   - Decision: selected now.

2. `readiness_receipt_registry_cross_claims`
   - Evidence: `scripts/validate_complete_autopilot_readiness_gate.js` and
     `tests/schema_examples/autopilot_receipt_registry.example.json`.
   - Risk: future readiness claims could cite receipts without proving registry
     and packet linkage together.
   - Decision: lower priority; queued after packet preflight.

3. `agent_board_resume_compaction_guard`
   - Evidence: `.agent_board` long-session status surfaces.
   - Risk: resume surfaces can lag behind validator improvements.
   - Decision: lower priority because action packet preflight is closer to the
     real Amber boundary.

4. `live_provider_action_packet_preflight`
   - Evidence: provider/plugin/API/image categories in v3 policy.
   - Risk: a live external call needs exact target, budget, and cost cap.
   - Decision: Red-blocked in this mission because real external actions are
     forbidden.

## Required Packet Boundaries

An Amber action packet must include:

- `packet_id`
- `task_id`
- `lane`
- `intent`
- `target_systems`
- `exact_allowed_paths_or_objects`
- `forbidden_paths_or_objects`
- `allowed_commands_or_operations`
- `max_call_count`
- `max_write_count`
- `max_cost_when_applicable`
- `selected_plugin_id`, `command`, and `model` when applicable
- `input_reference`
- `output_directory_or_write_target`
- `overwrite_existing_files_allowed`
- `secret_value_read_allowed=false`
- `raw_private_data_print_allowed=false`
- `dependency_manifest_change_allowed` plus exact package list when applicable
- `rollback_or_cleanup_plan`
- `validation_required`
- `stop_conditions`
- `evidence_to_record`
- `receipt_required`
- `registry_entry_required`
- `continuation_judge_required`

## Negative Cases

`scripts/validate_autopilot_amber_action_packet_preflight.js` mutates the
known-good packet into known-bad packets. Every bad case must fail.

Covered cases:

- missing packet id
- nonzero provider budget in the local preflight fixture
- unknown or unbounded cost
- secret value read allowed
- raw private data print allowed
- overwrite existing files allowed
- dependency manifest change without exact package list
- missing rollback plan
- missing validation
- missing stop conditions
- missing receipt requirement
- provider side-effect flag set to true

Checked fixtures:

```text
tests/schema_examples/autopilot_amber_action_packet.example.json
tests/schema_examples/autopilot_amber_action_packet_negative_cases.example.json
```

MVP integration:

```text
scripts/validate_mvp.ps1
```

## Evolution Update

After this phase, `amber_action_packet_preflight_v1` is recorded as a completed
capability in the Evolution Engine. The next recommended local hardening task
advances to:

```text
readiness_receipt_registry_cross_claims_v1
```
