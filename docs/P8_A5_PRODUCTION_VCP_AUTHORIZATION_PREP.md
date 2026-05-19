# P8 A5 Production and VCP Authorization Prep

base_contract: AGENTS.md
mode: A4.8 authorization preparation only
status: prepared_validated_no_execution

## Purpose

Define the A5 preparation order after portable evidence, Review Console static
capsule display, accepted/failure sample planning, and registry validation are
stable.

## Preparation Order

1. Production candidate authorization package.
2. Real VCP manifest read authorization package.
3. VCPChat read-only integration package.
4. VCPToolBox read-only integration package.
5. DailyNote / VCP memory write package.

## Minimum A5 Package Fields

```yaml
target_systems: []
exact_allowed_paths_or_objects: []
forbidden_paths_or_objects: []
allowed_commands_or_operations: []
forbidden_commands_or_operations: []
rollback_plan: null
reviewer: Jenn
validation_required: []
stop_conditions: []
max_provider_or_plugin_calls: 0
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
production_candidate_write_allowed: false
```

## Readiness Gates Before A5

- at least one Git-portable accepted preview capsule validates
- registry validator v2 passes
- negative-case validator passes
- Review Console static capsule evidence is visible and safe
- failure sample evidence lane has a dry-run schema
- exact target system and paths are known
- rollback and reviewer are named

## Non-Authorization

- no provider, plugin, API, or image generation
- no DailyNote or VCP memory write
- no runtime integration
- no real manifest, VCPChat, or VCPToolBox read
- no production candidate promotion
- no push, tag, release, or deploy
