# v7.53a E2E Read-only Integration Plan

## 1. Purpose

定义本地端到端只读集成 fixture，把已完成组件串联为可验证的 E2E 只读链路。

## 2. E2E Chain

```
Step 1: Adapter (scripts/agent_image_lab_read_only_adapter.js) — local read-only → text_only_refs
Step 2: VCPToolBox Ingestion Mock (scripts/validate_vcptoolbox_read_only_ingestion_mock.js) — local mock, opaque refs only
Step 3: Safe Surface Package — local static package, safe summary + refs only
```

## 3. 设计原则

- E2E fixture 不是真实 VCPToolBox 调用
- E2E fixture 不是真实 VCPChat surface
- 只验证 payload 从 adapter 到 ingestion mock 到 safe surface package 的安全形状
- Adapter refs 在全链路中必须保持 opaque
- 不允许任何一步读取 refs 指向的文件内容
- 未来如需 dereference refs，必须单独设计 realpath containment，并另行授权

## 4. Strict Boundaries

全部外部副作用为 false：

- real_vcptoolbox_call_performed: false
- vcpchat_bridge_call_performed: false
- electron_started: false
- remote_debug_started: false
- cdp_call_performed: false
- daily_note_write_performed: false
- vcp_memory_write_performed: false
- image_generation_performed: false
- image_binary_read: false
- runs_path_read: false

## 5. Ref Policy

- refs_treated_as_opaque: true
- dereference_performed: false
- future_dereference_requires_realpath_containment: true

## 6. Non-goals

- 不是真实 VCPToolBox 调用
- 不是真实 VCPChat surface
- 不解引用 refs
- 不读取文件内容
- 不读取图片
- 不写入 memory
