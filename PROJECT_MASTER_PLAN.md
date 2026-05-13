# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
latest_visible_head_before_v7_259: 054cb21
origin_master_before_v7_259: 054cb21
status: failed_no_image_repeated_quota_or_rate_limit
mode: A4 product workflow fixture packet acceptance review
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
native_doubao_static_hardening: completed
diagnostic_decision: continue_generation_stop_until_route_selection
selected_route_now: ROUTE-3-CONTINUED-STOP
selected_route_meaning_zh: 路线 3，继续停止生成
route_selection_required_before_new_A5: true
review_surface_product_spec_created: true
review_record_template_created: true
status_flow_defined: true
static_review_surface_acceptance_checklist_created: true
static_review_surface_mockup_readiness_review_created: true
static_review_surface_mockup_spec_created: true
static_review_surface_mockup_file_created: true
static_review_surface_mockup_acceptance_review_completed: true
static_review_surface_mockup_acceptance_result: pass_with_warnings
accepted_final_explicit_state_patched: true
static_review_surface_quality_stop_reached: true
product_workflow_fixture_packet_created: true
product_workflow_fixture_packet_acceptance_passed: true
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The Prompt Package
Builder now defines the first controllable artifact before generation
authorization or provider contact: a reviewable product image prompt package.
v7.228 adds the fillable instance template for that package without creating a
real generation task. v7.229 adds the human review checklist and status taxonomy
that decide whether a package may be referenced by a future A5 authorization
draft. v7.230 adds the non-executing handoff template from approved package to
future A5 authorization draft inputs. v7.231 defines the future generated asset
status taxonomy and review surface fields. v7.232 defines the non-writing
memory suitability decision matrix. v7.233 links these artifacts into a single
Delivery / Review Surface Package. v7.234 turns the chain into an operator
runbook. v7.235 validates the chain with a synthetic matte ceramic coffee mug
walkthrough. v7.236 confirms the chain is ready for a non-active A5
authorization draft, not active execution. v7.237 creates that non-active draft.
v7.238 reviews it as safe A4 paperwork while keeping active A5 blocked. v7.239
creates a non-executing generation plan draft to provide a future plan
reference. v7.240 confirms the plan draft and authorization draft are
compatible at paper level while keeping active A5 blocked. v7.241 patches the
non-active authorization draft with the plan ref/version while leaving all
executable A5 fields blocked. v7.242 classifies the remaining active
authorization gaps and separates A4 paper-preparable fields from fields that
must wait for explicit active authorization. v7.243 simplified the authorization
draft into a one-page preflight-pending record. Subsequent active A5 diagnostic
attempts reached `failed_no_image_repeated_quota_or_rate_limit`; the same
provider/model/account path must not be retried until quota/rate-limit is
resolved or a different path is explicitly authorized. v7.244 reconciled state
surfaces to that reality. v7.245 hardens the Native Doubao local execution
surface statically: syntax check, prompt path containment, output containment,
base URL validation, env allowlist, public result redaction, exact call budget,
and validator drift. v7.246 makes the no-generation diagnostic readiness
decision: generation remains stopped until a human provides sanitized quota
resolution evidence or selects a different provider/model/account path for a
future paper-only decision package. v7.247 defines the paper-only decision
package: Route 1 external quota resolution, Route 2 provider/model/account
switch, and Route 3 continued stop. Route 3 is selected now. v7.248 closes
the current stop state and requests an explicit human route selection before
any new A5, provider contact, plugin call, image generation, or runtime action.
Under Route 3, v7.249 returns to the non-generation product mainline and
creates the static Review Surface product spec: page goal, user roles, core
fields, asset card structure, review decision area, memory suitability area,
handoff area, and no-execution boundaries.
v7.250 adds the paper review record template and status flow, including
accepted_candidate, rejected, needs_revision, deferred, rejection reasons,
revision request handling, and memory_suitability yes/no/deferred routing.
v7.251 adds the static Review Surface acceptance checklist for field
completeness, status flow, human decision priority, memory write prohibition,
A5/provider/plugin/runtime prohibition, and future mockup preconditions.
v7.252 reviews those artifacts and confirms the next safe product step is a
static mockup specification gate, not runtime implementation.
v7.253 defines the mockup specification: screen regions, fixture shape, Chinese
copy rules, disabled action reasons, and checklist mapping before any HTML or
runtime implementation. v7.254 creates a standalone offline static HTML mockup
file under `review_console/static_mockups/` with no external assets, scripts,
runtime imports, provider/plugin calls, image generation, or memory writes.
v7.255 reviews that HTML against the v7.251 checklist and v7.253 spec. It
passes the no-execution and core field checks, with one follow-up warning:
`accepted_final` should become an explicit future/blocked status in the mockup.
v7.256 patches that gap by adding `accepted_final` as an explicit
`future_blocked` status in the offline mockup while preserving no-execution.
v7.257 decides that the static Review Surface track has reached an A4 quality
stop. More static Review Surface polish is not the default next value; the next
useful product task should connect the paper workflow through a synthetic fixture
packet.
v7.258 creates that synthetic non-executing fixture packet, linking prompt
package input, future authorization placeholder, review record, asset status,
memory suitability decision, and delivery handoff.
v7.259 reviews that fixture packet and accepts it as a synthetic non-executing
paper-chain reference.

## Active Boundaries

```text
A5: not authorized
provider contact: not authorized
runtime execution: not authorized
plugin call: not authorized
image generation: not authorized
DailyNote / VCP memory write: not authorized
real manifest / VCPChat / VCPToolBox read: not authorized
tag / release / deploy / push: not authorized by this file
```

## Operating Model

Use one persistent commander as the source of judgment. Use temporary
`codex exec` Workers only for exact task contracts. Use read-only Verifiers only
for evidence review. The commander remains responsible for final scope review,
validation interpretation, staging, commit decisions, and next-task selection.

## Recommended Next

Recommended next is `v7.260_product_workflow_paper_chain_quality_stop_gate`
（产品图纸面链路质量停止门）. It should decide whether the product image
paper workflow has reached quality stop or whether another non-executing product
artifact is still justified.
