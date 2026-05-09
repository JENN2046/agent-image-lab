# A5 单次真实生成 — 统一授权模板

**填写前请阅读 `docs/264_v7_7_single_real_generation_activation_readiness_check.md`**。

提示词通过 `prompt_package_ref` 引用独立 YAML 包，不内嵌完整 prompt。

---

## 模板

```yaml
a5_single_real_generation:
  activation_status: pending          # 激活后改为 active
  execution_authorized_by_this_record: false  # 激活后改为 true

  baseline:
    branch: master
    commit: 38b154c
    tag: v6.10-rc1-product-runtime

  plugin_call_profile_ref: plugin_calls/image_generation/doubaogen_generate_v1.yaml

  generation:
    selected_plugin_id: DoubaoGen     # 示例值
    selected_plugin_command: generate # 示例值
    prompt_package_ref: null          # 填写完整相对路径，如 prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml
    output_directory: null            # 仅限 runs/ 下，如 runs/real_generation/run_name/
    max_plugin_calls: 1
    max_images_created: 1
    retry_allowed: false

  limits:
    memory_write_allowed: false
    daily_note_write_allowed: false
    push_allowed: false
    tag_allowed: false
    release_allowed: false

  post_run:
    asset_review_required: true
    human_review_required: true
    memory_write_still_blocked: true
    daily_note_write_still_blocked: true
```

## 填写说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `plugin_dir` | 必须由**你手动确认**路径，agent 不能猜测 | `C:\VCP\VCPToolBox\Plugin\DoubaoGen` |
| `prompt_package_ref` | 完整相对路径 | `prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml` |
| `output_directory` | 仅限 `runs/` 下 | `runs/real_generation/v7_7_first_run/` |
| `max_plugin_calls` | 固定 1 | `1` |
| `max_images_created` | 固定 1 | `1` |

## ⚠️ 重要

- **"继续 / 可以 / 去吧" 不是 A5 激活。**
- 只有填写完整 A5 表并将 `activation_status` 改为 `active`、`execution_authorized_by_this_record` 改为 `true`，才可进入真实生成。
- memory write / DailyNote write 不在本次授权范围内。
- push/tag/release 不在本次授权范围内。

## 提示词包列表

当前 20 个包可用，详见 `prompts/image_generation/README.md`。
推荐首发：`prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml`
