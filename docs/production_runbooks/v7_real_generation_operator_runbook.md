# v7 Real Generation — Operator Runbook

## 前置条件

- A5 激活包已填写并提交（`docs/a5_templates/a5_activation_form.md`）
- `plugin_dir` + `vcptoolbox_root` 已提供
- 所有 validators 通过
- HEAD == origin/master
- working tree clean

## 执行步骤

```text
1. preflight 验证
2. 创建输出目录（runs/real_generation/{run_name}/）
3. 调用插件（1 次 generate）
4. 写入输出
5. 进入 Asset Acceptance Gate
6. 回报结果
```

## 禁止

```text
- 自动 retry
- 自动写 memory / DailyNote
- push / tag / release
- 第二次插件调用
- 读取 PluginDir 外路径
```
