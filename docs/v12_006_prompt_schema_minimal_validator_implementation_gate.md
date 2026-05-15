# v12.006 Prompt Schema Minimal Validator Implementation Gate

```yaml
gate_template:
  phase: v12_006_prompt_schema_minimal_validator_implementation_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  source_phase: v12_005_prompt_schema_validator_implementation_authorization_gate
  source_commit: b37cf2d98ea59334b8500555399ae1eb19c15f8c
```

## Implementation Summary

v12.006 creates the minimal Prompt Schema Machine Validator v1:

- `scripts/validate_prompt_schema.js`
- `tests/fixtures/prompt_schema_validator/manifest.json`
- synthetic PASS / WARN / FAIL fixtures under `tests/fixtures/prompt_schema_validator/`

The validator is a Node.js script using only built-in modules. It is read-only,
manifest-driven, explicit-file only, and does not recursively scan the
repository.

## Rule Coverage

The validator covers the v12.003 rule families:

- prompt package rules
- product brief rules
- static review rules
- A5 authorization rules
- human review rules
- accepted candidate evidence package rules
- route-level validation rules

The v1 implementation intentionally uses conservative text and literal-block
checks rather than a dependency-backed YAML parser. That keeps the validator
small and dependency-free while still catching the drift classes that V11/V12
identified.

## Fixture Behavior

The synthetic fixture manifest expects:

- 6 PASS fixtures
- 8 FAIL fixtures
- 2 WARN fixtures

Manifest mode treats expected FAIL fixtures as successful tests when the
validator observes a fail outcome. Unexpected mismatches return a nonzero exit.

## Boundaries

This phase does not:

- migrate existing artifacts
- modify existing prompt packages
- modify `prompts/image_generation/`
- change runner behavior
- add dependencies
- modify `package.json` or lockfiles
- contact providers
- generate images
- read `.env.local`
- write memory
- enter production
- enter runtime

## Closeout

```yaml
phase: v12_006_prompt_schema_minimal_validator_implementation_gate
machine_validator_implemented: true
fixture_files_created: true
scripts_modified: true
validator_path: scripts/validate_prompt_schema.js
fixture_manifest: tests/fixtures/prompt_schema_validator/manifest.json
existing_artifacts_migrated: false
runner_behavior_changed: false
dependency_change: false
package_json_modified: false
provider_contact: false
image_generation: false
memory_write: false
production_candidate_002: false
recommended_next:
  phase: v12_007_prompt_schema_validator_static_review_and_syntax_gate
  auto_execution_allowed: true
final_state:
  next_phase_started: false
```
