# Capsule Registry YAML Parser Closeout

## Status

`completed_validated_pending_commit`.

This closeout records the authorized dependency change that replaces regex-style accepted sample registry parsing with a real YAML parser.

## Authorization

The user explicitly authorized this follow-up after the previous hardening closeout deferred YAML parser replacement as a dependency-changing item.

## Changed behavior

- Added `yaml@2.9.0` to local project dependencies.
- `scripts/lib/accepted_sample_registry_source.js` now parses `accepted_samples/accepted_sample_registry.yaml` with `YAML.parse`.
- `parseRegistryRows()` now reads `accepted_sample_registry.samples[]` as structured YAML data.
- Registry parsing now validates:
  - registry version exists
  - sample id is unique
  - registry-level `memory_write_allowed` is false
  - registry-level `daily_note_write_allowed` is false
  - sample-level `write_to_memory_allowed` is false
  - sample-level `daily_note_write_allowed` is false
  - existing category index relation still includes the sample
- `scripts/validate_create_preview_capsule_registry_source.js` now checks that the registry source uses `yaml` and no longer depends on the old sample-id block regex.

## Boundary

- This is a local parser dependency only.
- It does not authorize provider contact, plugin calls, API calls, image generation, DailyNote writes, VCP memory writes, runtime execution, real manifest reads, VCPChat reads, or VCPToolBox reads.
- It does not read or mutate `runs/`.
- It does not create, copy, convert, or register new capsule preview binaries.

## Validation

Validated:

- `node --check scripts\lib\accepted_sample_registry_source.js`
- `node scripts\validate_create_preview_capsule_registry_source.js`

Pending final closeout validation:

- `git diff --check`
- `node scripts\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1`

## Recommended next

Run final local validation, then create an exact-file guarded commit and push if preflight remains clean.
