# A5 Single Real Generation — Unified Template

本模板是 A5 单次真实生成的统一授权模板。
**填写前请阅读 `docs/264_v7_7_single_real_generation_activation_readiness_check.md`**。

提示词通过 `prompt_package_ref` 引用独立 YAML 包，不内嵌完整 prompt。

---

## 模板

```yaml
a5_single_real_generation:
  # ── Metadata ──
  activation_status: pending
  execution_authorized_by_this_record: false

  # ── Baseline ──
  baseline:
    branch: master
    commit: 4e987ec
    tag: v6.10-rc1-product-runtime

  # ── External Roots（运行期必填，不写入 Git）──
  external_roots:
    plugin_dir: null              # DoubaoGen 插件在 VCPToolBox 中的路径
    vcptoolbox_root: null         # VCPToolBox 根目录

  # ── Generation Scope ──
  generation:
    selected_plugin_id: DoubaoGen
    selected_plugin_command: generate
    prompt_package_ref: null      # 指向 prompts/image_generation/*.yaml
    output_directory: null        # 仅限 runs/ 下
    max_plugin_calls: 1
    max_images_created: 1
    retry_allowed: false

  # ── Hard Limits ──
  limits:
    memory_write_allowed: false
    daily_note_write_allowed: false
    push_allowed: false
    tag_allowed: false
    release_allowed: false

  # ── Post-Run ──
  post_run:
    asset_review_required: true
    human_review_required: true
    memory_write_still_blocked: true
    daily_note_write_still_blocked: true
```

## 使用方式

```text
1. 填写 prompt_package_ref → 指向 prompts/image_generation/ 下的 YAML 文件
2. 填写 plugin_dir + vcptoolbox_root（运行期使用，不写 Git）
3. 填写 output_directory
4. 将 activation_status 改为 active
5. 将 execution_authorized_by_this_record 改为 true
6. 贴入对话执行
```

## 提示词包列表

| package_ref | 文件 | 说明 |
|---|---|---|
| `product_still_life_outdoor_tennis_v1` | `prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml` | 户外网球静物商业摄影 |
