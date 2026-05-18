# v7.49 VCP Integration Readiness Pack

## 1. Purpose

- 本文件定义 Agent Image Lab 与 VCP 的接入准备方案。
- 本阶段不执行真实 VCP 接入。
- 本阶段不写 DailyNote / VCP memory。
- 本阶段只定义未来接入协议。

## 2. Current Source State

```yaml
source_project: JENN2046/agent-image-lab
current_prompt_package: prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml
production_readiness: candidate_ready_with_manual_visual_review
stability_status: stable_candidate
next_real_generation_requires_independent_a5: true
image_binary_git_policy: forbidden
memory_write_allowed_now: false
daily_note_write_allowed_now: false
```

## 3. VCP Integration Layer Architecture

Agent Image Lab 在 VCP 生态中的位置分为 4 层：

### Layer 1: Repository Evidence Layer

- 存放 prompt package、review records、stability plans、closeout docs
- 已全部完成为 git-tracked markdown
- 所有评审证据可追溯、可索引

### Layer 2: Case Summary Layer

- 将 repository evidence 收束为结构化 case_summary
- 供 VCP memory 写入前做最终内容确认
- 定义见 `docs/archive/phases/v7/v7_49_vcp_case_summary_schema.md`

### Layer 3: VCP Memory Candidate Layer

- 从 case_summary 提取允许写入 VCP memory 的字段
- 定义可写内容和禁止内容
- 定义见 `docs/v7_49_vcp_memory_write_boundary_spec.md`

### Layer 4: DailyNote / VCP Long-term Memory Write Layer

- 仅在有独立 A5 授权时执行
- 写入前必须 canonical location 校验
- plugin success 不等于 memory write complete

## 4. Current Mode

```yaml
system_role: visual_production_orchestration_layer
vcp_role: downstream_case_summary_and_memory_candidate_source
vcp_toolbox_role: future_memory_and_tool_runtime
vcpchat_role: future_review_console_and_human_approval_surface
current_mode: docs_only_readiness
real_vcp_call_authorized: false
memory_write_authorized: false
daily_note_write_authorized: false
```

## 5. Boundary

- 本 pack 不授权任何真实 VCP 操作。
- 每次真实 VCP memory write / DailyNote write 都需要独立 A5 授权。
- 当前只做 protocol design，不做 execution。
