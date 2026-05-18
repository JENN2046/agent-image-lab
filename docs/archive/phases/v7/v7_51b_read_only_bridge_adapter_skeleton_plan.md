# v7.51b Read-only Bridge Adapter Skeleton Planning

## 1. Purpose

本文件规划未来 read-only bridge adapter skeleton。
本阶段不创建 adapter 代码，不调用 VCP，不调用 VCPChat bridge。
只定义未来 adapter 的输入、输出、错误状态和 hard blockers。

## 2. Scope

- 本阶段不创建 adapter 代码
- 不调用 VCP
- 不调用 VCPChat bridge
- 只定义未来 adapter 的输入、输出、错误状态和 hard blockers
- adapter_runtime_implemented: false
- adapter_call_performed: false

## 3. Adapter Boundary

### Request

```yaml
request:
  bridge_mode: read_only
  payload_type: text_only_refs
  write_intent: false
  image_binary_requested: false
  secrets_requested: false
  raw_payload_requested: false
  private_absolute_path_requested: false
```

### Response

```yaml
response:
  status_allowed:
    - ok
    - blocked
    - not_found
    - failed
  payload_type: text_only_refs
  returned_refs_only: true
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
```

### Hard Blockers

- bridge_mode_not_read_only
- write_intent_detected
- image_binary_requested
- secret_requested
- raw_payload_requested
- private_absolute_path_requested
- memory_write_attempted
- dailynote_write_attempted
- production_approved_claim_detected
- closed_case_reopen_attempted

## 4. Non-goals

- 不实现 adapter runtime
- 不调用 VCP
- 不调用 VCPChat bridge
- 不创建 adapter 代码文件
- 不读取图片二进制

## 5. Future Execution Boundary

未来如果进入 v7.51c adapter implementation，需明确授权创建 adapter 代码。
本阶段是 adapter skeleton planning，不是 adapter implementation。
