# v7.50 VCP Read-only Bridge Planning

## 1. Purpose

本文件定义 Agent Image Lab 未来接入 VCP / VCPChat 的只读桥规划。
本阶段只设计桥，不启动桥。
本阶段不授权任何真实 VCP 调用、不授权 memory write、不授权 DailyNote write。

## 2. Bridge Position

```yaml
bridge_name: agent_image_lab_vcp_read_only_bridge
bridge_mode: read_only
current_stage: planning_only
real_bridge_call_authorized: false
vcp_call_authorized: false
vcpchat_bridge_authorized: false
memory_write_authorized: false
daily_note_write_authorized: false
image_generation_authorized: false
```

## 3. Bridge Purpose

未来只读桥只用于让 VCP / VCPChat 读取 Agent Image Lab 的"已审查文本证据"，包括：

- project state
- case summary candidate
- production readiness status
- human review checklist
- A5 one-shot template
- memory write boundary spec
- evidence chain refs

## 4. Bridge Non-goals

- 不生成图片
- 不调用图片 API
- 不写 memory
- 不写 DailyNote
- 不自动批准生产图
- 不读取图片二进制
- 不读取 raw request / raw response
- 不读取 secrets
- 不访问真实 VCP 私有路径
- 不调用工具插件
- 不修改仓库

## 5. Future Bridge Flow

```text
VCPChat / Review Console
→ request read-only case summary
→ Agent Image Lab read-only evidence index
→ return sanitized text-only package
→ human review surface
→ optional future memory_delta draft
→ separate A5 required before any write
```

## 6. Current Stop Line

- 本文件不授权桥接执行。
- 本文件不授权 VCP call。
- 本文件不授权任何 write。
- 本文件只允许后续进入 v7.51 production candidate plan 或继续 docs-only bridge refinement。
