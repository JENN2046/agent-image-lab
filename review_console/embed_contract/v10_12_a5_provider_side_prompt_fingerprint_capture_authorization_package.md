# v10.12 A5 Provider-side Prompt Fingerprint Capture Authorization Package Contract

本文定义 v10.12 provider-side prompt fingerprint capture authorization package contract。它描述未来一次无图片生成的 provider-side echo / sanitized request capture，但当前状态保持 inactive。

```yaml
contract:
  name: v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package
  version: v10.12-a5-provider-side-prompt-fingerprint-capture-authorization-package
  status: inactive_authorization_package_ready
  record: docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md
  authorization_package: integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md
  validation_file: scripts/validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js
  execution_authorized_by_this_record: false
```

## Diagnostic Boundary

```yaml
diagnostic_boundary:
  prompt_id: a5_positive_still_life_prompt_v1
  expected_prompt_sha256_utf8: f9967d3348a24db6a55652a4c7661f4385aa85c4287b45cba420c9495dece9b6
  selected_plugin_id: DoubaoGen
  selected_plugin_command: provider_side_prompt_fingerprint_capture
  max_generation_calls_allowed: 0
  max_provider_echo_calls_allowed_after_activation: 1
  image_creation_allowed: false
  raw_request_body_recording_allowed: false
  endpoint_recording_allowed: false
```

## Next Gate

```yaml
next_gate:
  activation_requires_exact_phrase: "批准 v10.12 provider侧指纹捕获"
  generation_retry_requires_new_authorization: true
  alternate_plugin_requires_new_authorization: true
  daily_note_memory_requires_accepted_asset_and_new_authorization: true
  commit_tag_push_pr_release_requires_separate_authorization: true
```
