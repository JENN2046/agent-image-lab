# Phase F Retrospective

Phase F MVP-B 受控真实执行复盘。记录成功经验、发现的问题和后续建议。

```yaml
retrospective:
  status: completed
  phase: "Phase F retrospective"
  runs: 2
  accepted: 2
  rejected: 0
```

## Successes

| # | 经验 | 详情 |
| --- | --- | --- |
| 1 | 人像 prompt 有效 | `a5_portrait_prompt_v1` 双图均通过审片，无文字/logo/扭曲 |
| 2 | Bridge smoke 干净 | VCPChat v4.4.2，4 通道全部验证，0 side effects |
| 3 | Runner transport 稳定 | UTF-8 no BOM byte-write 连续 2 次成功 |
| 4 | F1→F8 流程完整 | 8 阶段 pipeline 首次端到端验证通过 |
| 5 | 审片标准适配 | 人像专用 criteria（person/face = expected）正确工作 |

## Issues

| # | 问题 | 影响 | 建议 |
| --- | --- | --- | --- |
| 1 | 模型不匹配 | 请求 5.0，插件返回 3.0（与 v10.14 相同） | 非阻塞，图片质量可接受；如需精确模型需在插件侧排查 |
| 2 | cancel 需 object payload | 字符串 payload 被 handler 拒绝 | 后续调用传 `{reason: "..."}` 对象格式 |
| 3 | submitDraft 未被硬阻断 | handler 返回 soft-accept（stored=false） | 当前行为可接受（无真实写入）；如需硬阻断需改 handler |

## Stats

```yaml
stats:
  total_plugin_calls: 2
  total_images: 2
  acceptance_rate: "100% (2/2)"
  average_image_size_kb: 208
  bridge_channels: 4
  bridge_side_effects: 0
  stages_executed: 7
  stages_skipped: 1 (F7 memory write)
  auth_package_consumed: true
```

## For Next Phase F Run

```yaml
recommendations:
  - "换 prompt 前先做 prompt safety scan"
  - "人像 prompt 可复用 a5_portrait_prompt_v1（已验证）"
  - "如需不同风格/性别/年龄，调整 prompt 中的描述词即可"
  - "bridge smoke 可跳过（已在本 Phase 验证），直接从 F3/F4 开始"
  - "如需 memory write，填 docs/231 时设 daily_note_write_allowed=true"
```
