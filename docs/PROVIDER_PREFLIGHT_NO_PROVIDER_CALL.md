# Provider Preflight No Provider Call

```yaml
phase: provider_preflight_no_provider_call
lane: Green
status: completed_validated
adapter: adapters/runtime/provider_preflight_no_provider_call.js
validator: scripts/validate_provider_preflight_no_provider_call.js
provider_runner_source: scripts/run_native_doubao_image_generation.js
```

## Purpose

`provider_preflight_no_provider_call` prepares the next provider stage without
crossing into provider execution.

It creates a local preflight packet for the `NativeDoubaoImage` route using the
existing secretless runner preflight, but keeps all execution budgets at zero and
sets `can_execute_now: false`.

## Boundaries

```yaml
preflight_only: true
can_execute_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
api_call_allowed_now: false
image_generation_allowed_now: false
secret_value_read_allowed: false
env_file_content_read_allowed: false
output_write_allowed_now: false
production_write_allowed_now: false
accepted_samples_write_allowed_now: false
DailyNote_write_allowed_now: false
VCP_memory_write_allowed_now: false
push_tag_release_deploy_allowed_now: false
```

The provider binding reference is represented only as a redacted, non-secret
capability handle:

```text
native_doubao:capability:owner-runtime:<redacted>
```

No `.env`, `.env.local`, provider secret, raw provider payload, output file,
production candidate, accepted sample, DailyNote entry, VCP memory entry, push,
tag, release, or deploy is read or written by this preflight.

## Validation

Run:

```powershell
npm run validate:provider-preflight
```

The validator checks:

- provider preflight packet is Green and `can_execute_now=false`
- provider/plugin/API/image/write budgets are zero
- cost is zero and unknown cost is Red
- provider binding ref is redacted and non-secret
- secretless runner preflight passes without reading env content or secret values
- unsafe output roots, unredacted binding refs, true side-effect flags, provider
  call budget drift, and execution enablement fail closed

This is not an A5 execution packet and not an image generation authorization.
