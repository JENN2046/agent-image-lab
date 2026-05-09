# v7.4 Memory Write Gate Package

## 目的

定义真实生成后，何时允许进入 memory write 申请。

本轮不写 memory。

## 声明

```yaml
memory_write_gate:
  status: inactive_gate
  memory_write_authorized: false
  daily_note_write_authorized: false
  actual_write_performed: false
  requires_asset_status: accepted_candidate
  requires_human_review: true
  requires_separate_a5_authorization: true
  rejected_asset_blocks_memory: true
  needs_human_review_blocks_memory: true
  blocked_asset_blocks_memory: true
```

## 规则

```text
1. memory write 和 image generation 是两次独立授权
2. 生成成功不等于可以写记忆
3. accepted_candidate 也不自动写记忆
4. 只有人工确认后，才可进入独立 A5 memory write 授权包
5. DailyNote write 默认 blocked
6. VCP memory write 默认 blocked
```
