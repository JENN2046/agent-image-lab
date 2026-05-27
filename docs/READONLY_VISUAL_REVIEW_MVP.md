# Readonly Visual Review MVP

```yaml
phase: readonly_visual_review_mvp
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: local_plan_implementation_target
```

## Purpose

This task lands the P3.22 readonly review artifact system as a local Review
Console MVP. It makes the 24-artifact review catalog, pass / patch / reject
rows, taxonomy tags, metadata queue sections, next actions, and guard state
visible in the static prototype and draft output.

## Inputs

```text
tests/schema_examples/visual_eval_readonly_review_artifact_catalog.example.json
tests/schema_examples/visual_eval_readonly_review_corpus_renderer.example.json
tests/schema_examples/visual_eval_review_console_readonly_corpus_renderer_static_handoff.example.json
```

## Output

```text
readonly_visual_review_mvp_state
```

The output is a browser-memory draft state only. It is not an approval record,
production candidate, accepted_samples write, memory write, provider call, or
runtime integration.

## Boundaries

```yaml
runtime_execution_performed: false
fetch_performed: false
file_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
accepted_samples_write_performed: false
production_candidate_created: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
```

## Validation

```text
node scripts/validate_readonly_visual_review_mvp.js
npm run validate:mvp
```
