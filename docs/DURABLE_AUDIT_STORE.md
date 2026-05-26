# Durable Audit Store

```yaml
phase: durable_audit_store
lane: Green
status: completed_validated
adapter: adapters/runtime/durable_audit_store.js
validator: scripts/validate_runtime_durable_audit_store.js
runtime_source: kernel/runtime_kernel_v0.js
review_bridge_source: adapters/runtime/review_bridge_readonly_stub.js
```

## Purpose

`durable_audit_store` persists local runtime audit evidence into a Git-ignored,
append-only store under `.agent_private/runtime_audit_store/`.

It records:

- one immutable run audit record
- one immutable task index record
- one immutable hash-chain record

The store accepts both Green `completed_stub` runtime results and Red
`blocked_red` runtime results. Review bridge data is stored only for Green
runtime results and only as read-only display metadata.

## Boundaries

```yaml
local_audit_write_performed: true
store_root: .agent_private/runtime_audit_store/
git_ignored_required: true
overwrite_existing_allowed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
production_write_performed: false
accepted_samples_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

This is not a production audit database, not a VCP memory write, not a provider
receipt, and not a Review Console approval workflow.

## Layout

```text
.agent_private/runtime_audit_store/<namespace>/
  runs/<run_id>.audit.json
  tasks/<task_id>/<run_id>.task-index.json
  chains/<sequence>_<run_id>.chain.json
```

All writes use no-overwrite mode. A duplicate `run_id` fails closed. Store roots
outside `.agent_private/runtime_audit_store/` and traversal paths fail closed.

## Validation

Run:

```powershell
npm run validate:durable-audit-store
```

The validator checks:

- Green runtime audit records are stored with review bridge metadata.
- Red runtime audit records are stored without review bridge metadata.
- task index lookup returns stored runs.
- hash chain sequence and previous hash links are stable.
- duplicate run id, outside store root, traversal, dirty side-effect flags, Red
  review bridge input, and review bridge task drift fail closed.

Validation writes only temporary files under `.agent_private/runtime_audit_store/`
and removes the temporary validation namespace after the check.
