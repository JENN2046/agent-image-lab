# Codex Session Image Provider Minimal Import Contract

```yaml
phase_id: v14_099_codex_session_image_provider_minimal_import_contract
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: draft_local_contract
```

## Purpose

Codex Session Image Provider is a manual bridge for bringing an image generated in the Codex conversation into Agent Image Lab review flow.

It is not a project-callable provider. It is not MCP runtime. It is not an automated image generation plugin.

The minimum useful loop is:

```text
prompt package managed by Agent Image Lab
→ human asks Codex session image tool to generate an image
→ human or operator places the generated image under an explicit runs/real_generation/... directory
→ Agent Image Lab records a codex_session_image_import draft
→ normal review, scoring, and memory suitability decisions can reference that imported asset
```

## Non-Authorization

```yaml
codex_image_direct_call_allowed: false
mcp_runtime_allowed: false
provider_api_call_allowed: false
project_script_generation_allowed: false
image_generation_by_script: false
env_local_secret_value_read_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
real_manifest_read_allowed: false
real_VCPChat_read_allowed: false
real_VCPToolBox_read_allowed: false
push_tag_release_deploy_allowed: false
```

## Import Record

Each imported image must have a local metadata record matching:

```text
schemas/codex_session_image_import.schema.yaml
```

The record must identify:

```text
provider_id = codex_session_image
import_mode = manual_session_import
prompt_package_ref
output_directory_ref
imported file name
image dimensions when known
review status
all no-execution guard flags
```

## Review Boundary

An import record can enter review as a draft image case.

It cannot by itself:

```text
mark an asset accepted
write accepted_samples
create production_candidate
write DailyNote
write VCP memory
authorize another generation
authorize MCP runtime
authorize provider/API calls
```

## Validation

Minimum local validation:

```powershell
node --check scripts/validate_codex_session_image_import.js
node scripts/validate_codex_session_image_import.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
git diff --check
```

## Next Safe Use

After this contract exists, a future Codex-generated image can be imported by creating a real import record that points to a real local image path. That import remains a local review artifact until a separate human decision accepts or rejects it.
