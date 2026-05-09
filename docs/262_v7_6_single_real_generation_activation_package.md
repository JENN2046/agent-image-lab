# v7.6 Single Real Generation Activation Package

## 目的

创建第一次真实生成的 A5 激活包。定义激活条件、执行边界、后处理要求。
本轮不执行真实生成，激活包保持 inactive。

## 当前基线

```text
commit: 9fd0931
tag: v6.10-rc1-product-runtime
```

## 激活包结构

```yaml
v7_6_activation_package:
  status: inactive_package
  execution_authorized_by_this_record: false

  baseline:
    branch: master
    commit: 9fd0931
    tag: v6.10-rc1-product-runtime

  preflight_required:
    working_tree_clean: true
    validator_chain_passed: true
    output_directory_policy_reviewed: true
    asset_acceptance_gate_ready: true
    memory_write_gate_blocked: true

  generation_scope:
    selected_plugin_id: null
    selected_plugin_command: null
    prompt_package_ref: null
    max_plugin_calls: 1
    max_images_created: 1

  hard_limits:
    retry_allowed: false
    memory_write_allowed: false
    daily_note_write_allowed: false
    push_allowed: false
    tag_allowed: false
    release_allowed: false

  post_run_required:
    asset_review_required: true
    human_review_required: true
    memory_write_blocked_after_run: true
    daily_note_write_blocked_after_run: true
```

## 依赖前置

```text
v7.0 — landing preflight
v7.1 — controlled run package
v7.2 — failure taxonomy + retry policy
v7.3 — asset acceptance gate
v7.4 — memory write gate
v7.5 — production run dry-run prep
```

## 激活路径

```text
1. 用户确认 all preflight_required 条件
2. 用户填写 generation_scope 字段
3. 用户将 status 改为 active，execution_authorized_by_this_record 改为 true
4. preflight 验证通过后执行
5. 执行后按照 post_run_required 处理
```

## 禁止

```text
- 激活包 inactive 状态下不得执行
- 未确认 preflight 不得执行
- 超过 max_plugin_calls 不得继续
- 超过 max_images_created 不得继续
- retry 需新授权
- 生成成功不等于可以写记忆
```
