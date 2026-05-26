# Review Bridge Readonly Stub

```yaml
phase: review_bridge_readonly_stub
lane: Green
status: completed_validated
adapter: adapters/runtime/review_bridge_readonly_stub.js
validator: scripts/validate_runtime_review_bridge_readonly_stub.js
runtime_source: kernel/runtime_kernel_v0.js
```

## Purpose

`review_bridge_readonly_stub` maps a completed local runtime kernel result into
Review Console-readable draft data without performing any write or external
action.

It consumes:

- `intake.task`
- `artifact_adapter.handoff_record`
- `audit_record`
- `transition`
- `review`

It produces:

- `review_console_case_data.image_case_draft`
- `review_console_case_data.review_session_draft`

## Boundaries

```yaml
display_only: true
writes_allowed_now: false
approve_reject_write_allowed_now: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
production_write_performed: false
accepted_samples_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
secret_value_read_performed: false
```

Red or blocked runtime results do not enter the bridge. Approval, rejection,
archive, accepted samples, production candidate, provider, image generation, and
memory write paths remain blocked and require later explicit gates.

## Validation

Run:

```powershell
npm run validate:review-bridge-readonly
```

The validator checks:

- Green runtime result maps to a read-only `review_session_draft`.
- Green runtime artifact handoff maps to an `image_case_draft`.
- Runtime audit and state path are attached as display evidence.
- Red runtime result is rejected.
- Side-effect flag drift, artifact handoff drift, and review decision drift fail
  closed.

This adapter is a local runnable capability. It is not production review
workflow, VCPChat integration, provider integration, memory writing, or
commercial approval.
