# v11.001 Route Selection Gate

```yaml
phase: v11_001_route_selection_gate
base_contract: AGENTS.md
mode: A4.8
intent: route_selection
risk_level: R1
source_phase: v10_018_v10_final_closeout_remote_sync
source_commit: 223b1550f57e422c1bf4336c4619ef65ec4509c3
```

## Purpose

This gate presents the V11 route options after V10 has been closed.

It is a docs-only route selection gate. It does not authorize provider contact,
image generation, retry, `.env.local` secret value reads, memory write,
`accepted_samples/` write, `production_candidate_002`, runtime implementation,
or any real commercial delivery action.

## Current State

```yaml
V7_closed: true
V8_closed: true
V9_closed: true
V10_closed: true
current_gate: v11_route_selection_gate
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
```

## V11 Route Options

### Option A - Prompt Schema Hardening

```yaml
route: prompt_schema_hardening
meaning: 固化 product brief / prompt package / static review / A5 authorization draft 的 schema。
risk: low
A4_8_auto_progress_possible_after_human_selection: true
recommended: true
```

This is the recommended route because V7, V8, and V10 have now produced three
product lanes. The useful next move is to harden the shared paperwork and YAML
shape so future product lanes do not drift across `prompt`, `positive_prompt`,
review, evidence, and A5 authorization fields.

### Option B - Review Console Productization Planning

```yaml
route: review_console_productization_planning
meaning: 把 review、asset status、evidence package、delivery readiness、route gate 抽象成未来 UI / console 产品面。
risk: medium
runtime_implementation_allowed: false
```

This route is useful if the next product value is turning the document chain
into a planned review surface. It remains planning-only and does not enter
runtime, CDP, bridge, MCP, VCPChat, or VCPToolBox integration.

### Option C - Fourth Product Prompt Workflow Expansion

```yaml
route: fourth_product_prompt_workflow_expansion
meaning: 选择第四商品，继续 brief -> prompt package -> static review -> A5 decision gate。
risk: low_to_medium
default_generation_allowed: false
```

This route expands category coverage, but it should start with docs-only brief
and prompt planning. Any real generation would require a later, explicit A5
authorization.

### Option D - Delivery Completion Package Track

```yaml
route: delivery_completion_package_track
meaning: 围绕已有 accepted candidates 补 export naming、QA sheet、handoff、delivery checklist。
risk: low
image_or_delivery_execution_allowed: false
```

This route improves delivery paperwork without touching images or performing
commercial delivery.

### Option E - Memory Suitability Planning

```yaml
route: memory_suitability_planning
meaning: 只做 memory suitability / memory write planning。
risk: medium_high
memory_write_allowed: false
recommended_now: false
```

This route remains planning-only. It must not write DailyNote, VCP memory, or
any memory surface.

### Option F - Production Candidate 002 Readiness Planning

```yaml
route: production_candidate_002_readiness_planning
meaning: 只做 production_candidate_002 准备规划。
risk: high
production_candidate_002_allowed: false
recommended_now: false
```

This route must not enter production execution. It is not recommended as the
immediate V11 route.

## Recommendation

```yaml
recommended_option: prompt_schema_hardening
backup_option: review_console_productization_planning
not_recommended_now:
  - memory_write
  - production_candidate_002
  - real_retouch
  - accepted_samples_write
  - provider_contact
  - image_generation
human_decision_required: true
```

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
  runtime_execution: false
```

## Recommended Next

```yaml
phase: pending_human_v11_route_selection
auto_execution_allowed: false
purpose: 等待人工选择 V11 路线；不得自动进入 A5、memory、production、runtime 或 provider/image generation。
```
