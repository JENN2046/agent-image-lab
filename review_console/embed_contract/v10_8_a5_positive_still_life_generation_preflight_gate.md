# v10.8 A5 Positive Still-life Generation Preflight Gate Contract

此 contract 供 Review Console / bridge handoff 侧引用，用来表达 v10.8 只完成生成前授权门收束，不执行真实生成。

```yaml
contract_id: v10_8_a5_positive_still_life_generation_preflight_gate
current_phase: "v10.8 A5 positive still-life generation preflight gate"
previous_phase: "v10.7 A5 safer prompt review package"
execution_authorized: false
next_real_generation_allowed_by_this_record: false
```

```yaml
prompt_lock:
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_approved_by_user: false
  prompt_locked_for_future_authorization: true
  prompt_must_not_be_auto_edited: true
  prompt_cn: "明亮摄影棚桌面静物摄影。画面中心是一枚无标识相机镜头，周围摆放柔光灯板、空白色块卡、纯色亚克力几何片和干净浅灰桌面。所有物体表面保持空白、干净、无标记。真实产品摄影，高级柔光，简洁构图，留出干净背景。"
```

```yaml
required_authorization_gate:
  user_prompt_approval_required: true
  separate_real_generation_authorization_required: true
  selected_plugin_id_required: DoubaoGen
  selected_plugin_command_required: generate
  selected_plugin_model_required: doubao-seedream-5-0-260128
  max_plugin_calls_required: 1
  output_directory_ref_recommended: runs/a5_positive_still_life_prompt_v1
  overwrite_existing_files_allowed_required: false
  gatekeeper_approved_required: true
  review_console_human_approved_required: true
  daily_note_direct_write_allowed_required: false
  memory_delta_only_required: true
```

```yaml
no_execution_guard:
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  bridge_called: false
  submitDraft_called: false
```

该 contract 不允许 Review Console 自动升级为真实执行，也不允许把 prompt 自动改写后调用插件。
