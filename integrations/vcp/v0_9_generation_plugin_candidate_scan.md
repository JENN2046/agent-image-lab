# v0.9 Generation Plugin Candidate Scan

This is a sanitized local candidate scan for the next Photo Studio OS image
generation attempt. It does not include raw manifests, config values, endpoints,
private paths, runtime logs, or plugin outputs.

## Scan Boundary

```yaml
scan_boundary:
  mode: local_read_only_candidate_discovery
  plugin_execution_performed: false
  config_values_output: false
  raw_manifest_output: false
  endpoint_raw_output: false
  secret_value_output: false
  daily_note_called: false
  image_file_created_by_scan: false
```

## Candidate Fingerprints

```yaml
candidates:
  - candidate_id: ComfyUIGen
    fit_for_photo_studio_os: high
    supports_negative_prompt: true
    supports_workflow_control: true
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: best control surface if a local backend and workflow are configured

  - candidate_id: ComfyCloudGen
    fit_for_photo_studio_os: high
    supports_negative_prompt: true
    supports_workflow_control: true
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: strong workflow control but adds cloud credential and service dependency

  - candidate_id: QwenImageGen
    fit_for_photo_studio_os: medium_high
    supports_negative_prompt: true
    supports_workflow_control: false
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: simpler than Comfy workflow; likely easier than Doubao for explicit negative constraints if configured

  - candidate_id: ZImageGen2
    fit_for_photo_studio_os: medium_high
    supports_negative_prompt: true
    supports_workflow_control: false
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: good fallback candidate if configured

  - candidate_id: ZImageTurboGen
    fit_for_photo_studio_os: medium
    supports_negative_prompt: true
    supports_workflow_control: false
    supports_seed: false
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: useful for fast retries, weaker reproducibility

  - candidate_id: NovelAIGen
    fit_for_photo_studio_os: low_medium
    supports_negative_prompt: true
    supports_workflow_control: false
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: likely style-biased; not first choice for clean product software cover

  - candidate_id: GeminiImageGen
    fit_for_photo_studio_os: medium
    supports_negative_prompt: false
    supports_workflow_control: false
    supports_seed: false
    supports_size_control: false
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: prompt-following may be good, but control surface appears weaker

  - candidate_id: NanoBananaGen2
    fit_for_photo_studio_os: medium
    supports_negative_prompt: false
    supports_workflow_control: false
    supports_seed: false
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: false
    notes: not first choice for strict no-text/no-logo/no-people requirements

  - candidate_id: DoubaoGen
    fit_for_photo_studio_os: proven_runnable_but_unreliable_for_constraints
    supports_negative_prompt: false
    supports_workflow_control: false
    supports_seed: true
    supports_size_control: true
    supports_local_output_control: true
    currently_configured_in_plugin_dir: true
    notes: already produced two rejected assets due to people/text/logo-like content
```

## Recommendation

```yaml
recommendation:
  primary_candidate: ComfyUIGen
  reason: highest local control surface; workflow plus negative_prompt is better suited to suppress people, text, logos, and portrait-like content
  secondary_candidate: QwenImageGen
  reason: simpler API-style path with negative_prompt, seed, and size control if Comfy setup is not available
  avoid_for_next_retry:
    - DoubaoGen
    - GeminiImageGen
    - NanoBananaGen2
  next_gate: single_manifest_sanitized_review
  real_execution_allowed_now: false
```

## Next Authorization Template

```yaml
I authorize v0.10 single plugin manifest sanitized review:
  candidate_id: ComfyUIGen
  manifest_ref: "<plugin manifest path or repository-local reference>"
  read_mode: read_only
  single_manifest_only: true
  repository_wide_scan_allowed: false
  allowed_output:
    - sanitized Chinese display-name summary
    - sanitized Chinese command/parameter summary
    - sanitized Chinese input/output pattern summary
    - sanitized Chinese permission-risk summary
    - Gatekeeper review points
  forbidden_output:
    - raw manifest text
    - secrets, tokens, cookies, passwords
    - raw endpoints or webhook/database addresses
    - private paths
    - customer private data
    - runtime logs
    - real plugin output
  real_execution_authorized: false
```
