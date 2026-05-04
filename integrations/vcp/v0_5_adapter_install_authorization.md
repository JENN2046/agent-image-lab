# v0.5 Adapter Dry-Run Installation Authorization

本文定义未来把 AgentImageLabAdapter dry-run 草案安装到真实 VCPToolBox 前的授权门。当前文件不修改 VCPToolBox，不安装插件，不调用插件，不调用 API，不写 DailyNote。

## 授权申请必须包含

```yaml
v0_5_adapter_install_authorization:
  authorization_id: v0-5-adapter-install-auth-001
  target_vcptoolbox_ref: vcptoolbox-ref-placeholder
  install_scope:
    adapter_only: true
    real_generation_plugin_allowed: false
    overwrite_existing_files_allowed: false
  source_files:
    - exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json
    - exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js
    - exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md
  allowed_command: dry_run
  no_execution_guard:
    max_plugin_calls: 0
    external_api_allowed: false
    daily_note_called: false
    file_write_allowed: false
    image_file_created: false
  approval:
    user_authorized: false
    gatekeeper_required: true
    rollback_required: true
```

## 验收

- 只安装 Adapter dry-run 草案。
- 不安装真实生图插件。
- 不创建或调用真实执行命令。
- `dry_run` 调用返回草案对象。
- 插件调用、API 调用、DailyNote、文件写入、图片写入均为 0。

## 回滚

回滚只允许删除本次安装的 Adapter dry-run 草案文件或恢复备份。不得删除用户已有插件或运行数据。
