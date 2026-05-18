# Docs Archive D3 Registry Validator Dry-Run

Status: D3 completed as validator dry-run design.

Validator design: `docs_registry/registry_validator_dry_run.md`

## Scope

The validator rules check registry evidence against repository reality.

This phase does not modify existing validator behavior and does not add a runtime validator entrypoint.

## Core Rules

- registry paths must exist or have a non-active lifecycle status
- archive targets must stay under `docs/archive/`
- reference class must match the latest scan
- scripts/tests references force `validator_blocked`
- active documents cannot be archived-only authority

## Next

C1ag exact-file commit readiness audit.
