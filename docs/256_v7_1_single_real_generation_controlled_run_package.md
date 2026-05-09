# v7.1 Single Real Generation Controlled Run Package

## 目的

定义单次真实生成的"受控运行包"。

本轮只创建包，不执行真实生成。必须由用户明确 A5 激活。

## 声明

```yaml
v7_1_single_real_generation_controlled_run:
  status: inactive_package
  execution_authorized_by_this_record: false
  baseline_commit: e886b6b
  baseline_tag: v6.10-rc1-product-runtime
  max_plugin_calls: 1
  max_images_created: 1
  retry_allowed: false
  memory_write_allowed: false
  daily_note_write_allowed: false
  human_review_required: true
  asset_acceptance_gate_required: true
  push_allowed: false
  tag_allowed: false
  release_allowed: false
```

## 规则

```text
- max_plugin_calls=1: 只允许一次插件调用
- max_images_created=1: 最多生成 1 张图片
- retry_allowed=false: 禁止自动重试
- memory_write_allowed=false: 禁止自动写记忆
- daily_note_write_allowed=false: 禁止自动写 DailyNote
- human_review_required=true: 必须人工审片
- asset_acceptance_gate_required=true: 必须通过资产验收门
- push/tag/release=false: 禁止版本动作
```
