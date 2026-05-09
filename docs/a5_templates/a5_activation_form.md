# A5 单次真实生成 — 激活填写表

**"继续 / 可以 / 去吧" 不是 A5 激活。只有填写完整此表才可进入真实生成。**

参照模板：`docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md`

---

## 1. 基线确认

| 字段 | 默认值 | 你确认 |
|------|--------|--------|
| branch | `master` | □ |
| baseline commit | `38b154c` | □ |
| RC tag | `v6.10-rc1-product-runtime` | □ |

## 2. 插件调用配置（优先使用）

> `plugin_dir_ref` 已注册到 `configs/local_paths/doubaogen_plugin_dir.local.yaml`，不再要求每次手填 PluginDir。
> 如要修改 plugin_dir_ref，必须单独授权。

| 字段 | 值 |
|------|-----|
| `plugin_call_profile_ref` | `plugin_calls/image_generation/doubaogen_generate_v1.yaml` |

## 3. 生成范围

| 字段 | 说明 | 填写 |
|------|------|------|
| `selected_plugin_id` | 示例：`DoubaoGen` | |
| `selected_plugin_command` | 示例：`generate` | |
| `prompt_package_ref` | 完整相对路径，如 `prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml` | |
| `output_directory` | 仅限 `runs/` 下，如 `runs/real_generation/run_name/` | |
| `max_plugin_calls` | `1` | |
| `max_images_created` | `1` | |

## 4. 硬限制确认

| 限制 | 确认 |
|------|------|
| `retry_allowed` | `false` — 不自动重试 |
| `memory_write_allowed` | `false` — 不写记忆 |
| `daily_note_write_allowed` | `false` — 不写 DailyNote |
| `push_allowed` | `false` — 不推送 |
| `tag_allowed` | `false` — 不打 tag |
| `release_allowed` | `false` — 不发版 |

## 5. 预检确认（操作员逐项签名）

| 确认项 | 签名 |
|--------|------|
| HEAD == origin/master | |
| working tree clean | |
| validate_v7.0~v7.9 全部通过 | |
| validate_mvp.ps1 通过 | |
| PluginDir 路径已手动确认（非 agent 猜测） | |
| selected_plugin_id 已确认 | |
| prompt_package_ref 已确认 | |
| output_directory 已创建且位于 `runs/` 下 | |
| asset acceptance gate ready | |
| memory write gate blocked | |
| 理解 A5 只授权本次生成，不授权记忆写入 | |

## 6. 授权声明

```text
激活短语：A5-{日期}-{序号}

本人确认已理解上述条款，并授权执行一次受控真实生成。
生成结果将按照 v7.3 Asset Acceptance Gate 验收。
记忆写入和 DailyNote 写入不在本次授权范围内。
```

---

提交方式：将填写后的内容贴入对话。
