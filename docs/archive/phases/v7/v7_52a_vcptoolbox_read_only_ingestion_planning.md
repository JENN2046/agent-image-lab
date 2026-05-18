# v7.52a VCPToolBox Read-only Ingestion Planning

## 1. Purpose

本文件规划未来 VCPToolBox 如何以只读方式消费 Agent Image Lab adapter 返回的 text-only refs。
本阶段不调用真实 VCPToolBox。
本阶段不调用 VCPChat bridge。
本阶段不写 memory。
本阶段不读取图片二进制。
本阶段只规划 ingestion 入口、边界、数据包和 mock validation。

## 2. Phase State

```yaml
ingestion_planning:
  phase: v7_52a
  status: planning_only
  real_vcptoolbox_call_performed: false
  real_vcpchat_bridge_call_performed: false
  adapter_source: scripts/agent_image_lab_read_only_adapter.js
  adapter_mode: local_read_only
  ingestion_mode: read_only
  expected_payload_type: text_only_refs
  returned_refs_only: true
```

## 3. Core Principles

```yaml
principles:
  adapter_refs_are_opaque: true
  no_ref_dereference_in_mock: true
  future_dereference_requires_realpath_containment: true
  no_memory_write: true
  no_dailynote_write: true
  no_image_binary_read: true
  no_raw_payload_transfer: true
  no_secret_transfer: true
```

## 4. Ingestion Pipeline Overview

```
Adapter (text-only refs) → Ingestion Package Builder → No-write Policy Check
→ Visibility Check → Mock Result
```

| Step | Description | Allowed Actions |
|------|-------------|----------------|
| 1 | Spawn adapter locally, capture JSON stdout | `spawnSync`, JSON parse |
| 2 | Build ingestion package from adapter response | Map fields, validate shape |
| 3 | No-write policy check | Reject any write intent |
| 4 | Visibility check | Reject content/raw/secret/image |
| 5 | Output mock result | JSON summary to stdout |

## 5. Boundary

- Mock 阶段 adapter refs 被视为 opaque refs，不展开、不读文件内容
- 未来真实 ingestion 如果要展开 refs，必须新增单独授权和 realpath containment
- 本阶段不修改 adapter 本身
- 本阶段不修改 VCPToolBox/VCPChat 文件
