# A5 单次真实生成激活模板（统一表）

填写此表即表示你授权执行一次受控真实生成（single real generation）。
所有字段必填。提交后先执行 preflight，通过后执行，完成后进入 Asset Acceptance Gate。

参照模板：`docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md`

---

## 1. 基线确认

| 字段 | 默认值 | 填写 |
|------|--------|------|
| branch | `master` | |
| baseline commit | `4e987ec` | |
| RC tag | `v6.10-rc1-product-runtime` | |
| working tree clean | `true` | |

## 2. 外部依赖路径（必填）

> ⚠️ 这些路径指向 VCPToolBox 中的真实插件安装位置。
> 不会被记录到 Git。仅用于运行时调用。

| 字段 | 说明 | 填写 |
|------|------|------|
| `PluginDir` | DoubaoGen 插件在 VCPToolBox 中的安装目录 | |
| `vcptoolbox_root` | VCPToolBox 根目录 | |

## 3. 生成范围

| 字段 | 说明 | 填写 |
|------|------|------|
| `selected_plugin_id` | 插件 ID，例 `DoubaoGen` | |
| `selected_plugin_command` | 命令，例 `generate` | |
| `prompt_package_ref` | 提示词包引用，见 `prompts/image_generation/` | |
| `output_directory` | 输出目录（仅限 `runs/` 下） | |
| `max_plugin_calls` | 最大插件调用次数 | `1` |
| `max_images_created` | 最大生成图片数 | `1` |

## 4. 硬限制确认

| 限制 | 确认 |
|------|------|
| `retry_allowed` | `false` |
| `memory_write_allowed` | `false` |
| `daily_note_write_allowed` | `false` |
| `push_allowed` | `false` |
| `tag_allowed` | `false` |
| `release_allowed` | `false` |

## 5. 预检确认（操作员逐项签名）

| 确认项 | 签名 |
|--------|------|
| HEAD == origin/master | |
| working tree clean | |
| validate_v7.0~v7.8 全部通过 | |
| validate_mvp.ps1 通过 | |
| PluginDir 路径有效 | |
| selected_plugin_id 已确认 | |
| prompt_package_ref 已确认 | |
| output_directory 已创建且位于 `runs/` 下 | |
| asset acceptance gate ready | |
| memory write gate blocked | |
| 理解生成成功不等于可以写记忆 | |
| 理解本文档不授权后续操作 | |

## 6. 授权声明

```text
激活短语：A5-{日期}-{序号}

本人确认已理解上述条款，并授权执行一次受控真实生成。
生成结果将按照 v7.3 Asset Acceptance Gate 验收。
记忆写入和 DailyNote 写入不在本次授权范围内。
```

---

## 提交方式

将填写后的内容贴入对话。执行过程：

```text
填写表 → preflight → 插件调用（1次） → 资产验收 → 回报
```
