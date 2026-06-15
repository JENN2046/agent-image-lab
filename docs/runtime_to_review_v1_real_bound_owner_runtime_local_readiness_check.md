# Runtime To Review V1 Real Bound Owner Runtime Local Readiness Check

Schema: `runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.v1`

This gate is the local, no-provider readiness check before relying on the real-bound owner runtime module for a future guarded live probe.

It does not execute the live probe. It does not require a local VCPToolBox checkout to exist. It does not read provider secret values, `config.env` contents, raw logs, image binaries, VCPChat, VCPToolBox source, or a real plugin manifest.

## Scope

Allowed local reads:

- `docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md`
- `scripts/run_runtime_to_review_v1_guarded_live_probe.js`
- `scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js`
- `scripts/vcptoolbox_doubao_owner_runtime_child.js`
- `adapters/runtime/native_doubao_runtime_v1_provider_delegate.js`
- `adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js`
- `tests/schema_examples/runtime_to_review_v1_real_bound_owner_runtime_local_readiness_check.example.json`
- `package.json`
- `scripts/validation_manifest.json`

Forbidden now:

- `runtime-to-review:guarded-live-probe`
- provider contact
- plugin call
- API call
- image generation
- output write
- secret value read
- env/config/log/private raw data read
- real VCPChat read
- real VCPToolBox source read
- real plugin manifest read
- DailyNote or VCP memory write
- accepted sample or production candidate write
- commit, push, tag, release, or deploy

## Pass Conditions

- The guarded live probe runner still requires `RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE`.
- The exact-phrase runner check is preflight-only and reports no provider/plugin/API/image side effects.
- The real-bound owner runtime module exports `createSecretlessProviderRuntime`.
- The real-bound owner runtime keeps the output directory, prompt package, and model allowlist fixed.
- The parent process does not copy full `process.env` into the child runtime.
- Provider secret env keys are not forwarded by `buildSafeChildEnv`.
- The child runtime owns plugin config loading and only reports provider-key presence without printing values.
- Local readiness is independent from current VCPToolBox presence.
- The real-bound owner runtime has no implicit local owner-root default candidates.
- Missing explicit owner root is recorded as `owner_vcptoolbox_root_not_explicitly_configured` and fails closed before plugin/provider contact.

## Result Meaning

Passing this gate means the repository can locally prove the boundary before the real-bound owner runtime module is used.

It does not mean a live probe is authorized or ready. A future live probe still requires the exact confirmation phrase, one image max, an explicit owner-provided VCPToolBox root, a receipt/status sync, and explicit permission for the provider/plugin/API/image side effect.
