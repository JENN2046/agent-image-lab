# Command Tiers

Base contract: `AGENTS.md`

Purpose: make local operators and agents able to tell, before running a
command, whether it is validation-only, bounded preflight, or real execution.

This file does not authorize provider calls, image generation, secret reads,
memory writes, production writes, external repository writes, push, tag,
release, deploy, or destructive actions.

## Plain Rule

```yaml
default:
  validate_and_recommend_commands: Green_when_they_are_no_provider_no_secret_no_write
  preflight_and_packet_commands: Amber_when_exact_scope_and_receipt_rules_exist
  live_execute_provider_memory_or_production_commands: Red_unless_exact_owner_authorization_opens_a_bounded_Amber_packet
```

The command name is a hint, not authority. The actual source of truth is the
command implementation, the current user instruction, `AGENTS.md`, and observed
side-effect evidence.

## Green Commands

Green commands are local, repeatable, and safe to run as default validation.

Expected guarantees:

- no provider contact
- no plugin call
- no API call
- no image generation
- no secret value or env file content read
- no real VCPChat / VCPToolBox / manifest read
- no DailyNote or VCP memory write
- no accepted sample, production candidate, tag, release, deploy, or push

Typical examples:

```text
npm run validate:active
npm run validate:mvp
npm run validate:validation-manifest
npm run recommend:validation:next-commands
node scripts/validate_agent_board_state.js
node scripts/run_runtime_to_review_v1_guarded_live_probe.js --preflight-only ...
```

`--preflight-only` is Green only when the implementation proves it does not
call the provider, plugin, API, image generation, memory, or external source
paths.

## Amber Commands

Amber commands may prepare or execute one bounded action only when an exact
packet, exact scope, budget, validation, receipt path, and stop conditions are
present.

Amber types:

```yaml
Amber_A_exact_read:
  examples:
    - exact real manifest read
    - exact VCPChat / VCPToolBox read
  must_not:
    - read secrets
    - copy raw private data
    - modify external repositories

Amber_B_provider_image:
  examples:
    - one guarded live provider/image probe
  requires:
    - exact confirmation phrase
    - explicit owner-provided runtime root when relevant
    - one provider/plugin/API call max unless packet says otherwise
    - one image max unless packet says otherwise
    - receipt and status sync

Amber_C_memory:
  examples:
    - DailyNote / VCP memory write
  requires:
    - human-approved memory payload
    - memory suitability decision
    - retention and rollback/tombstone path

Amber_D_dependency_runtime:
  examples:
    - exact small dependency action
    - bounded local runtime probe
  requires:
    - exact package/action or runtime target
    - validation and rollback plan
```

Amber never means broad permission. It means one scoped action inside a budget.

## Red Commands

Red commands stop unless the owner gives exact authorization for that action.

Red by default:

- ad hoc provider execution
- ad hoc image generation
- direct native runner real execution
- secret or env file content reads
- unrestricted live probe
- production write or accepted sample promotion
- memory write without a separate memory gate
- broad external repository read/write
- dependency change without an exact package/action list
- push, tag, release, deploy, force push, history rewrite, destructive commands

## Naming Expectations

Future commands should make the tier obvious:

```yaml
preferred_prefixes:
  Green:
    - validate:
    - recommend:
    - inspect:
  Amber:
    - preflight:
    - packet:
    - receipt:
    - bounded:
  Red_or_exact_Amber_only:
    - live:
    - execute:
    - provider:
    - image:
    - memory-write:
```

If a command name and behavior disagree, behavior wins and the command should be
renamed or wrapped before operators rely on it.

## Current Runtime-To-Review Boundary

The current real-bound owner runtime path is not a normal smoke test.

It stays blocked until a future exact live authorization provides:

- `RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE`
- the real-bound owner runtime module
- an explicit owner-provided VCPToolBox root
- one provider/plugin/API call max
- one image max
- receipt and status sync
- no secret value read
- no memory write
- no production write
