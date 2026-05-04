# v0.6 Real Plugin Manifest Authorization

本文定义未来读取单一真实生图插件 manifest 的授权门。当前文件不读取真实 VCPToolBox，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote。

## 授权申请必须包含

```yaml
v0_6_real_plugin_manifest_authorization:
  authorization_id: v0-6-real-plugin-manifest-auth-001
  candidate_id: real-plugin-candidate-placeholder
  target_manifest_ref: manifest-ref-placeholder
  read_method: read_only
  single_manifest_only: true
  repository_wide_scan_allowed: false
  allowed_extract_fields:
    - plugin_display_name_summary_cn
    - command_summary_cn
    - input_output_summary_cn
    - permission_risk_cn
    - gatekeeper_notes_cn
  forbidden_extract_fields:
    - raw_manifest_text
    - api_key
    - token
    - endpoint_raw
    - private_path
    - customer_private_data
    - runtime_log
    - real_plugin_output
  approval:
    user_authorized: false
    gatekeeper_approved: false
```

## 输出

只允许输出中文脱敏摘要和状态结论：

- `manifest_reviewed_safe`
- `rejected`

不得因为 manifest 审查通过而进入 `dry_run_checked`、`tested` 或真实执行。
