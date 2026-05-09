# v7.0 Real Production Landing Preflight

## 目的

从 v6 draft-only 产品运行台进入 v7 真实生产落地前置阶段。

本轮只做预案、模板、预检和 gate 定义，不执行真实生成。

## 当前 v6.10 RC 基线

```text
branch: master
commit: e886b6b
tag: v6.10-rc1-product-runtime
```

## 为什么本轮不能真实生成

所有 v6 模块保持 `draft_only` / `no-execution`。v7.0 是生产落地前的备案阶段，不调用插件、不创建图片、不读真实 PluginDir。

## A5 授权的硬条件

```text
1. 用户提供明确 A5 授权包（含 selected_plugin_id、max_plugin_calls、prompt 引用）
2. preflight 通过（working tree clean、validator chain passed）
3. 输出目录策略已 review
4. 资产验收 gate 已 ready
5. 记忆写入 gate 默认 blocked
```

## 单次真实生成最小闭环

```text
A5 授权 → preflight → 单次插件调用 → 资产验收 → 人工审批 → 记忆写入申请 → closeout
```

## 资产验收 gate

```text
asset_status ∈ {accepted_candidate, needs_human_review, rejected}
- accepted_candidate → 可进入记忆写入流程
- needs_human_review → 需人工复核
- rejected → 关闭生成，不写记忆
```

## 失败分类

| 类别 | 说明 | 处理 |
|---|---|---|
| plugin_call_failed | 插件调用本身失败 | 重试或回滚 |
| image_created_but_rejected | 图片生成但审片拒绝 | 分析原因，不写记忆 |
| prompt_mismatch | 最终 prompt 偏离锁定版本 | 标记为失败，不继续 |
| unsafe_output | 输出含人物/文字/品牌等风险 | 自动拒收 |
| memory_write_blocked | 记忆写入被 gate 阻断 | 完成资产验收后停止 |

## 回滚策略

```text
- 插件调用失败：可以重试（需在授权上限内）
- 图片拒收：不写记忆，不创建 DailyNote
- 授权超限：立即停止
- 资产验收未通过：不进入后续流程
```

## 后续入口条件

v7.1 Single Real Generation Controlled Run 的入口：

```text
1. 用户提供 active A5 single_generation authorization
2. preflight 验证通过（validate_mvp.ps1、v6 validator quality gate）
3. 输出目录确认可写（不读取真实路径）
4. git working tree clean
5. 明确 selected_plugin_id 和 prompt_package_ref
```
