# v7.51c Read-only Bridge Adapter Implementation Planning

## 1. Purpose

本文件定义 Agent Image Lab 本地 read-only bridge adapter 的实现规划。
本阶段只是 docs-only planning，不实现 adapter runtime，不创建 adapter 代码。

## 2. Preconditions

```yaml
preconditions:
  v7_50d_surface_planning: completed
  v7_50d_static_fixture: pass
  v7_51a_evidence_index: defined
  v7_51b_adapter_skeleton: planned
  adapter_runtime_implemented: false
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
```

## 3. Adapter Definition

本地只读 adapter 不是 VCPToolBox 插件，也不是 VCPChat bridge。
它是 Agent Image Lab 仓库内的一个本地脚本，接收只读请求，返回 text-only refs。

## 4. Boundary

### Allowed

- 接收 case_id 和 requested_resources
- 返回 repository-relative text-only refs
- 返回状态：ok / blocked / not_found / failed
- 验证 safety gates

### Forbidden

- 返回图片二进制
- 默认返回文件全文
- 返回 raw payloads / secrets / private absolute paths
- 执行 memory write / dailynote write
- 调用 VCP / VCPChat bridge

## 5. Implementation Status

```yaml
adapter_implementation_status:
  runtime_implemented: false
  schema_validator_implemented: false
  security_gate_validator_implemented: false
  test_fixtures_implemented: false
  closeout_completed: false
```

下一步：进入 v7.51d 实现 adapter runtime。
