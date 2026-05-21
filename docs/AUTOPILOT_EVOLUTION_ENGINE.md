# Autopilot Evolution Engine v1

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
mode: Green Lane local governance tooling
status: active_local_gap_detector

## Purpose

The Evolution Engine keeps the long-running autopilot from becoming static. It
detects local governance gaps and proposes future safe tasks without crossing Red
Lane.

It is a local proposal engine, not a real executor. It does not call providers,
plugins, APIs, image systems, DailyNote, VCP memory, real manifests, VCPChat,
VCPToolBox, runtime probes, dependency tools, push, release, deploy, or secret
read paths.

## Inputs

The v1 detector reads only known local governance surfaces:

```text
docs
validators
schema examples
receipt registry
.agent_board status surfaces
```

## Output

The output is a deterministic backlog:

```text
proposal_id
title
lane
detected_gap
proposed_local_task
allowed_write_targets
validation
red_boundary
required_authorization_or_action when applicable
```

Green proposals may become future local tasks. Red proposals are advisory only
and must never be self-authorized.

## Validation

`scripts/validate_autopilot_evolution_engine.js` verifies that:

```text
the detector output is deterministic
the checked fixture matches generated output
known local inputs exist
multiple future proposals exist
Red proposals are not self-authorized
side-effect flags are false
```
