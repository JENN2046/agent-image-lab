# v7.50e Real VCPChat Surface Check Planning

## 1. Purpose

本文件定义未来真实 VCPChat surface check 的规划。
本阶段只是规划未来真实 VCPChat surface check，不启动 VCPChat，不启动 Electron，不调用 bridge。

## 2. Preconditions

```yaml
preconditions:
  v7_50d_surface_planning: completed
  v7_50d_static_fixture_execution: passed
  v7_50d_surface_gates: 12_12_pass
  current_case_state: closed_no_memory_write
  real_vcp_call_performed: false
  vcpchat_bridge_call_performed: false
```

## 3. Future Goal

未来 v7.50e 的目标：

- 检查真实 VCPChat Review Console 是否能安全显示 read-only surface payload
- 只读
- text-only refs
- 不显示 image binary
- 不显示 secrets
- 不显示 raw payload
- 不显示 private absolute path
- 不渲染 memory write button
- 不渲染 generate image / retry button
- 不重开 closed_no_memory_write case

## 4. Non-goals

- 不调用真实 bridge
- 不调用 VCP
- 不写 DailyNote
- 不写 VCP memory
- 不生成图片
- 不读取图片二进制

## 5. Future Execution Boundary

未来如果进入 v7.50e execution，需明确授权：
- Electron 启动授权
- remote-debug 启动授权
- VCPChat bridge 只读调用授权

本阶段不执行任何真实 surface check。
