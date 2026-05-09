# v7.5 Production Run Dry Run Prep

## 目的

真实生成前 dry-run 准备。为第一次真实生成建立完整的地面流程。

## 当前基线

```text
commit: f13c6c3
tag: v6.10-rc1-product-runtime
```

## 依赖前置

- v7.0 Real Production Landing Preflight — 生产落地预案
- v7.1 Single Real Generation Controlled Run Package — 受控运行包
- v7.2 Generation Failure Taxonomy + Retry Policy — 失败分类与重试策略
- v7.3 Asset Acceptance Gate — 资产验收门
- v7.4 Memory Write Gate Package — 记忆写入闸门

## Dry-run prep 不等于真实生成

本阶段只做准备工作。不执行插件、不创建图片、不写记忆。

## A5 激活前必须人工确认

所有 required_human_confirmation 字段必须在 A5 激活前由用户确认。

## 真实生成最小操作路径

```text
1. confirm baseline
2. confirm plugin candidate
3. confirm prompt package
4. confirm output boundary
5. confirm asset acceptance gate
6. confirm memory write blocked
```

## 失败时停止条件

```text
- 前置依赖未完成 → stop
- plugin/manifest/PluginDir 未确认 → stop
- 输出目录策略未审查 → stop
- 验收 gate 未 ready → stop
- 记忆写入未 blocked → stop
```

## 产物记录要求

每次 dry-run prep 完成后记录：
- baseline commit
- 人工确认项状态
- hard limits 确认
- 后续下一步

## 下一步

```text
v7.6 Single Real Generation Activation Package
```
