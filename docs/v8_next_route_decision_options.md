# V8 Next Route Decision Options

```yaml
decision_package_id: v8_next_route_decision_options
source_phase: v8_005_next_route_decision_gate
source_commit: 795e4cd10fc636ce49e589863332fbbd4ea780f6
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
current_asset_status: accepted_candidate_with_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
generation_status: stopped
```

## Decision Purpose

V8 Route A is closed. The project now needs a human route decision before any
new product branch starts. This package presents the next safe route options and
their authorization requirements.

No option is executed by this package.

## Route 1 - Multi-Product Prompt Package Expansion

```yaml
route_id: multi_product_prompt_package_expansion
meaning_zh: 多产品 prompt package 扩展
risk: low
mode: A4_docs_only
requires_A5: false
requires_provider_contact: false
requires_image_generation: false
requires_runtime: false
requires_memory_write: false
default_allowed_now: selectable_by_human
```

Value:

- expands the product workflow from one matte ceramic mug to more product
  categories;
- builds reusable prompt/review/delivery package examples without generation;
- improves product coverage before spending more provider calls.

Boundary:

- no real image generation;
- no provider call;
- no accepted samples write;
- no production candidate promotion.

## Route 2 - Review Console Productization Planning

```yaml
route_id: review_console_productization_planning
meaning_zh: Review Console 产品化规划
risk: medium
mode: A4_or_A4_5_planning_only
requires_A5: false_for_planning
requires_runtime: false_for_planning
runtime_implementation_allowed_now: false
```

Value:

- turns the static Review Surface and delivery package chain into a sharper
  product requirement set;
- prepares future UI/runtime integration without implementing runtime code.

Boundary:

- no renderer/preload/IPC implementation;
- no VCPChat/VCPToolBox read;
- no bridge/CDP/MCP access.

## Route 3 - Memory Planning Package

```yaml
route_id: memory_planning_package
meaning_zh: 记忆规划包
risk: medium
mode: A4_docs_only
requires_memory_write: false_for_planning
memory_write_allowed_now: false
```

Value:

- decides whether the V7/V8 product loop has lessons worth preserving;
- drafts sanitized Chinese memory suitability criteria without writing memory.

Boundary:

- no DailyNote write;
- no VCP memory write;
- no memory_write_path execution.

## Route 4 - Production Readiness Planning

```yaml
route_id: production_readiness_planning
meaning_zh: 商业交付准备度规划
risk: medium_to_high
mode: A4_planning_only
requires_production_candidate_authorization_later: true
production_candidate_002_allowed_now: false
```

Value:

- defines what must happen before the current v4 candidate or a retouched
  derivative can be considered for production readiness;
- clarifies required human review, retouch evidence, delivery package, and
  promotion gates.

Boundary:

- no production_candidate_002;
- no accepted_samples write;
- no asset copy/move/stage;
- no commercial delivery promotion.

## Route 5 - Human Retouch Execution Outside Codex

```yaml
route_id: human_retouch_execution_outside_codex
meaning_zh: 人工修图外部执行
risk: medium
mode: human_external_work
codex_execution_allowed_now: false
```

Value:

- lets a human retoucher use the v8 handoff package to create a final asset;
- keeps Codex from modifying or committing image outputs.

Boundary:

- Codex does not edit image files;
- Codex does not write `runs/` or `accepted_samples/`;
- a later review gate must inspect the retouched result before any promotion.

## Recommendation

```yaml
recommended_low_risk_route: multi_product_prompt_package_expansion
reason: "It grows product value while staying A4 docs-only and avoiding provider/runtime/memory risk."
human_decision_required: true
auto_execution_allowed_after_this_gate: false
```

## Stop Condition

After this decision package is committed, the project must stop at
`pending_human_route_selection`. No new route may begin automatically.
