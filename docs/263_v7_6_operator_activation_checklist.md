# v7.6 Operator Activation Checklist

操作员在激活 A5 前逐项确认。

## 预检确认

```yaml
operator_activation_checklist:
  status: inactive_checklist
  activation_authorized: false

  baseline_confirmed:
    commit_matches_remote: false
    tag_confirmed: false

  preflight_confirmed:
    working_tree_clean: true
    validator_chain_passed: true
    output_directory_policy_reviewed: true
    asset_acceptance_gate_ready: true
    memory_write_gate_blocked: true

  generation_scope_confirmed:
    selected_plugin_id_confirmed: false
    selected_plugin_command_confirmed: false
    prompt_package_ref_confirmed: false
    max_plugin_calls_confirmed: false
    max_images_created_confirmed: false

  hard_limits_acknowledged:
    retry_not_allowed: true
    memory_write_not_allowed: true
    daily_note_write_not_allowed: true
    push_not_allowed: true
    tag_not_allowed: true
    release_not_allowed: true

  post_run_acknowledged:
    asset_review_required: true
    human_review_required: true
    memory_write_still_blocked: true
    daily_note_write_still_blocked: true
```

## 操作员签名

```text
操作员姓名: 
确认日期: 
A5 授权引用: 
```
