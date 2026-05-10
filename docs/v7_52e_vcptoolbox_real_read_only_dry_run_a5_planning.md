# v7.52e Real VCPToolBox Read-only Dry-run A5 Planning

## 1. Purpose

本阶段只是规划未来真实 VCPToolBox read-only dry-run A5，不执行真实调用。

## 2. Preconditions for Future Real Dry-run

```yaml
future_real_vcptoolbox_dry_run_preconditions:
  independent_A5_required: true
  real_vcptoolbox_endpoint_defined: true
  no_write_mode_supported: true
  no_memory_write_policy_confirmed: true
  no_dailynote_write_policy_confirmed: true
  refs_are_opaque_by_default: true
  dereference_requires_realpath_containment: true
  dry_run_allows_one_call_only: true
  retry_allowed: false
```

## 3. Hard Stops

- no real call without independent A5
- no memory write
- no dailynote write
- no image binary read
- no refs dereference without containment
- no production approved claim

## 4. Current Status

```yaml
current_status:
  real_vcptoolbox_call_performed: false
  vcpchat_bridge_call_performed: false
  electron_started: false
  remote_debug_started: false
  cdp_call_performed: false
  daily_note_write_performed: false
  vcp_memory_write_performed: false
  image_generation_performed: false
  image_binary_read: false
  runs_path_read: false
```

## 5. Next Step After Authorization

当真实 VCPToolBox read-only dry-run 得到独立 A5 授权后：

1. 确认 real_vcptoolbox_endpoint 可用
2. 确认 no-write mode 被 VCPToolBox 支持
3. 执行单次只读 dry-run 调用
4. 验证 adapter refs 以 opaque 形式被 VCPToolBox 接收
5. 输出 dry-run 结果
6. 关闭 case，不写 memory
