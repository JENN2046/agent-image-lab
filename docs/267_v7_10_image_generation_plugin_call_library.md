# v7.10 Image Generation Plugin Call Library

## 目的

建立生图插件调用库。将 DoubaoGen generate 的调用方式固化为可复用、可审查、不可误执行的配置。

## 新增结构

```text
plugin_calls/
  README.md
  image_generation/
    README.md
    doubaogen_generate_v1.yaml

configs/local_paths/
  doubaogen_plugin_dir.local.yaml

schemas/
  plugin_call_profile.schema.yaml
```

## DoubaoGen generate 调用配置

- `plugin_dir_ref` 指向 `configs/local_paths/doubaogen_plugin_dir.local.yaml`
- 不再要求用户每次手填 PluginDir
- `prompt_package_ref` 接入 `prompts/image_generation/`
- `output_policy` 限制到 `runs/real_generation/`

## 边界

```text
- 该配置不是 A5 执行授权
- plugin_dir_ref 已注册，不代表执行授权
- 如果要修改 plugin_dir_ref，必须单独授权
- 真正执行仍需用户单独 A5 激活
- 不得读取真实 PluginDir
- 不得验证真实文件系统
- 不得扫描父目录
- max_plugin_calls=1
- max_images_created=1
- retry_allowed=false
- memory_write_allowed=false
- daily_note_write_allowed=false
```
