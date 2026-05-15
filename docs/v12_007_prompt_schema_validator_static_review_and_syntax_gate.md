# v12.007 Prompt Schema Validator Static Review And Syntax Gate

```yaml
gate_template:
  phase: v12_007_prompt_schema_validator_static_review_and_syntax_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  source_phase: v12_006_prompt_schema_minimal_validator_implementation_gate
  source_commit: f7db96e67e874fe81d85fdaa2a083fa37322cdae
```

## Static Review Result

Result: `pass_for_static_review_and_syntax_gate`.

The v12.006 validator implementation matches the authorized shape:

- `scripts/validate_prompt_schema.js` is Node.js only
- no dependency was added
- `package.json` and lockfiles were not modified
- the script reads only the manifest path passed by `--manifest` and files listed in that manifest, or explicit CLI file arguments
- it does not recursively scan the repository
- it does not perform glob discovery
- it does not read `.env.local`
- it does not mutate files
- it does not run Git commands
- it does not call providers, plugins, APIs, memory, production, or runtime

## Syntax And Fixture Smoke Evidence

The following checks passed during v12.006 and are carried into this review:

```text
node --check scripts/validate_prompt_schema.js
node scripts/validate_prompt_schema.js --manifest tests/fixtures/prompt_schema_validator/manifest.json
```

The manifest run checked 16 synthetic fixtures:

- 6 expected PASS fixtures
- 8 expected FAIL fixtures
- 2 expected WARN fixtures

All expected outcomes matched.

## Static Review Notes

The validator intentionally uses conservative text-pattern checks instead of a
YAML parser. This is acceptable for v1 because the current target is a minimal,
dependency-free guard that catches known schema drift classes, not a complete
schema engine.

The manifest mode treats expected FAIL fixtures as passing tests when the
validator observes a fail outcome. This makes the fixture manifest usable as a
test harness without weakening normal explicit-file validation, which exits
nonzero on errors.

## Boundaries Reconfirmed

```yaml
machine_validator_implemented: true
fixture_files_created: true
scripts_modified: true
existing_artifacts_migrated: false
existing_prompt_packages_modified: false
provider_contact: false
image_generation: false
env_local_secret_value_read: false
memory_write: false
production_candidate_002: false
runtime_execution: false
dependency_change: false
package_json_modified: false
package_lock_modified: false
```

## Closeout

```yaml
phase: v12_007_prompt_schema_validator_static_review_and_syntax_gate
static_review_result: pass_for_static_review_and_syntax_gate
syntax_check_passed: true
manifest_smoke_passed: true
validator_passed_on_synthetic_fixtures: true
machine_validator_implemented: true
fixture_files_created: true
scripts_modified: true
existing_artifacts_migrated: false
existing_prompt_packages_modified: false
provider_contact: false
image_generation: false
memory_write: false
production_candidate_002: false
recommended_next:
  phase: v12_008_prompt_schema_validator_fixture_execution_gate
  auto_execution_allowed: true
final_state:
  next_phase_started: false
```
