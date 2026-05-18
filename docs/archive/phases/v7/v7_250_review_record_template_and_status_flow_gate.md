# v7.250 Review Record Template And Status Flow Gate

```yaml
gate_template:
  phase: v7.250_review_record_template_and_status_flow_gate
  phase_zh: 审片记录模板与状态流门
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/v7_250_review_record_template_and_status_flow_gate.md
    - docs/review_record_template_and_status_flow.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
    - scripts/validate_current_state_alignment.js
  validation:
    required:
      - git status -sb
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - node --check scripts/validate_current_state_alignment.js
      - node scripts/validate_current_state_alignment.js
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Executive Verdict

```yaml
overall_status: pass
current_status: failed_no_image_repeated_quota_or_rate_limit
route_3_meaning_zh: 继续停止生成
review_record_template_created: true
status_flow_defined: true
rejection_reasons_defined: true
revision_request_defined: true
accepted_candidate_conditions_defined: true
memory_suitability_routing_defined: true
A5_execution_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
runtime_execution_allowed_now: false
memory_write_allowed_now: false
recommended_next: v7.251_static_review_surface_acceptance_checklist_gate
recommended_next_zh: 静态审片台验收清单门
```

## What This Adds

v7.250 turns the v7.249 static Review Surface product spec into a paper review
record and state machine. It defines how one future asset moves through:

```text
not_created → generated_pending_review → accepted_candidate / rejected / needs_revision / deferred
```

中文意思：

```text
尚未生成 → 已生成待审 → 可接受候选 / 拒绝 / 需要修订 / 暂缓
```

## Boundary

```yaml
not_authorized_by_v7_250:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  renderer_preload_IPC_code: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  real_manifest_read: false
  env_or_secret_read: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.250_review_record_template_and_status_flow_gate
  review_record_template_created: true
  status_flow_defined: true
  route_3_continued_stop_preserved: true
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  memory_write: false
  recommended_next: v7.251_static_review_surface_acceptance_checklist_gate
```
