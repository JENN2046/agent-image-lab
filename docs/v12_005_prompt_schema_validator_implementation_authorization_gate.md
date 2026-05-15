# v12.005 Prompt Schema Validator Implementation Authorization Gate

```yaml
gate_template:
  phase: v12_005_prompt_schema_validator_implementation_authorization_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  source_phase: v12_004_prompt_schema_validator_fixture_planning_closeout_or_implementation_decision_gate
  source_commit: 127bd71c8b4cdfc522a84b37c8808ef323c67c72
```

## Purpose

This gate records the human selection of v12.004 Option B:
`enter_validator_implementation_authorization_gate`.

It authorizes the next implementation phase, v12.006, to create a minimal,
read-only, dependency-free Prompt Schema Machine Validator v1 and synthetic
fixtures. This gate itself does not create validator code, fixture files, or
test directories.

## Authorized Next Implementation Scope

v12.006 may add or modify only:

- `scripts/validate_prompt_schema.js`
- `tests/fixtures/prompt_schema_validator/manifest.json`
- `tests/fixtures/prompt_schema_validator/pass/*`
- `tests/fixtures/prompt_schema_validator/fail/*`
- `tests/fixtures/prompt_schema_validator/warn/*`
- `docs/v12_006_prompt_schema_minimal_validator_implementation_gate.md`
- allowed status surfaces listed in the current phase contract

The validator must be:

- Node.js only
- no new dependency
- read-only
- manifest-driven
- explicit-file only
- non-recursive
- no glob scan
- no provider call
- no `.env.local` read
- no file mutation
- no Git operation

## Required Validator Behavior For v12.006

The future validator must read only:

1. the manifest passed by `--manifest`, and
2. the files explicitly listed inside that manifest.

It must output a structured JSON-like summary to stdout.

Exit behavior:

- exit `0` when all manifest fixture outcomes match expected PASS/WARN/FAIL
- exit `0` for warning-only validation when warnings are expected
- exit nonzero for unexpected errors
- exit nonzero for malformed manifest or missing files

## Required Fixture Categories

Synthetic fixtures must cover:

- PASS examples for prompt package, product brief, static review, A5 authorization gate, human review, and accepted candidate evidence package
- FAIL examples for missing canonical prompt, unsynchronized positive prompt, non-literal negative prompt, provider-contact implication, missing A5 budget, static review claiming generation, missing commercial delivery boundary, and missing memory suitability
- WARN examples for legacy prompt packages missing `product_brief_ref` and legacy reviews missing watch items

Fixtures must not include real provider payloads, real secrets, generated
images, copied `runs/` output, accepted samples, or production records.

## Non-Goals

This phase and the next implementation phase do not:

- migrate existing artifacts
- modify existing prompt packages
- modify `prompts/image_generation/`
- change runner behavior
- add dependencies
- modify `package.json` or lockfiles
- enter provider contact
- generate images
- write memory
- enter production
- enter runtime

## Validation Plan

v12.006 and later validation must include:

```text
git status -sb
git diff --check
node --check scripts/validate_prompt_schema.js
node scripts/validate_prompt_schema.js --manifest tests/fixtures/prompt_schema_validator/manifest.json
node scripts/validate_agent_board_state.js
node scripts/validate_current_state_alignment.js
node scripts/validate_native_doubao_sandbox.js
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Closeout

```yaml
phase: v12_005_prompt_schema_validator_implementation_authorization_gate
selected_route: prompt_schema_machine_validator_implementation_planning
selected_option_from_v12_004: enter_validator_implementation_authorization_gate
implementation_authorized_for_v12_006: true
machine_validator_implemented: false
fixture_files_created: false
scripts_modified: false
existing_artifacts_migrated: false
provider_contact: false
image_generation: false
memory_write: false
production_candidate_002: false
runtime_execution: false
recommended_next:
  phase: v12_006_prompt_schema_minimal_validator_implementation_gate
  auto_execution_allowed: true
final_state:
  next_phase_started: false
```
